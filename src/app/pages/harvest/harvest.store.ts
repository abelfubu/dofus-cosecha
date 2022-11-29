import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs/operators';

import { HarvestDataService } from './services/harvest-data.service';

import { Harvest, HarvestType } from './models/harvest';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ChartSlice } from 'src/app/shared/chart/chart.model';

export type UserHarvest = Pick<Harvest, 'id' | 'captured' | 'amount'>;

export interface HarvestFilters {
  showCaptured: boolean;
  showRepeatedOnly: boolean;
  search: string | null;
  steps: boolean[];
}

export interface HarvestData {
  statistics: ChartSlice[][];
  originalData: Harvest[];
  harvest: Harvest[];
  filters: HarvestFilters;
}

const DEFAULT_STATE: HarvestData = {
  statistics: [],
  originalData: [],
  harvest: [],
  filters: {
    showRepeatedOnly: false,
    showCaptured: true,
    search: null,
    steps: [...new Array(34)].map(() => true),
  },
};

interface GetDataResponse {
  data: Harvest[];
  userData: Record<number, Harvest>;
}

@Injectable({
  providedIn: 'root',
})
export class HarvestStore extends ComponentStore<HarvestData> {
  private readonly DOFUS_HARVEST_KEY = 'dof.harv';

  constructor(
    private readonly harvestDataService: HarvestDataService,
    private readonly localStorageService: LocalStorageService
  ) {
    super(DEFAULT_STATE);
  }

  readonly harvest$ = this.select(({ harvest }) => harvest);
  readonly steps$ = this.select(({ filters }) => filters.steps);
  readonly statistics$ = this.select(({ statistics }) => statistics);

  readonly getData = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.harvestDataService.get().pipe(
          tapResponse(
            (data) => {
              this.setData({
                data,
                userData: this.localStorageService.get(this.DOFUS_HARVEST_KEY),
              });
            },
            (error) => console.log(error)
          )
        )
      )
    )
  );

  readonly setData = this.updater(
    (state, { data, userData }: GetDataResponse) => {
      const mappedData = data.map((item) => {
        const found = userData?.[item.id];

        if (!found) return item;

        return { ...item, ...found };
      });

      return {
        ...state,
        statistics: this.calculateStatistics(mappedData),
        originalData: mappedData,
        harvest: mappedData,
      };
    }
  );

  readonly search = this.updater((state, search: string | null) => {
    const filters = { ...state.filters, search };

    return {
      ...state,
      filters,
      harvest: this.applyFilters(state.originalData, filters),
    };
  });

  readonly completed = this.updater((state, showCaptured: boolean | null) => {
    const filters = { ...state.filters, showCaptured: !!showCaptured };

    return {
      ...state,
      filters,
      harvest: this.applyFilters(state.originalData, filters),
    };
  });

  readonly repeated = this.updater(
    (state, showRepeatedOnly: boolean | null) => {
      const filters = {
        ...state.filters,
        showRepeatedOnly: !!showRepeatedOnly,
      };

      return {
        ...state,
        filters,
        harvest: this.applyFilters(state.originalData, filters),
      };
    }
  );

  readonly steps = this.updater((state, steps: Record<number, boolean>) => {
    const filters = { ...state.filters, steps: Object.values(steps) };

    return {
      ...state,
      filters,
      harvest: this.applyFilters(state.originalData, filters),
    };
  });

  readonly update = this.updater((state, item: UserHarvest) => {
    const storage = this.localStorageService.update<Partial<Harvest>>(
      this.DOFUS_HARVEST_KEY,
      item.id,
      item
    );

    const callback = (i: Harvest) =>
      i.id === item.id ? { ...i, ...storage } : i;

    const originalData = state.originalData.map(callback);

    return {
      ...state,
      originalData,
      statistics: this.calculateStatistics(originalData),
      harvest: this.applyFilters(state.harvest.map(callback), state.filters),
    };
  });

  private applyFilters(source: Harvest[], filters: HarvestFilters): Harvest[] {
    return source.reduce<Harvest[]>((acc, item) => {
      if (!filters.showCaptured && item.captured) {
        return acc;
      }

      if (filters.showRepeatedOnly && !item.amount) {
        return acc;
      }

      if (!filters.steps[item.step - 1]) {
        return acc;
      }

      if (
        filters.search &&
        !Object.values(item)
          .filter((value) => typeof value === 'string')
          .map((value) => this.normalize(value))
          .some((value) =>
            value.includes(this.normalize(String(filters.search)))
          )
      ) {
        return acc;
      }

      acc.push(item);
      return acc;
    }, []);
  }

  private calculateStatistics(data: Harvest[]): ChartSlice[][] {
    const [monsters, bosses, archis] = [
      { type: HarvestType.MONSTER, amount: 299 },
      { type: HarvestType.BOSS, amount: 50 },
      { type: HarvestType.ARCHI, amount: 288 },
    ].map(({ type, amount }) => {
      return this.calculatePercentage(
        data.filter((item) => item.captured && item.type === type).length,
        amount
      );
    });

    const total = this.calculatePercentage(
      data.filter((item) => item.captured).length,
      data.length
    );

    return [
      [
        {
          id: 1,
          label: 'Monstruos',
          color: 'red',
          percent: monsters,
        },
        {
          id: 2,
          label: '',
          color: 'salmon',
          percent: 100 - monsters,
        },
      ],
      [
        {
          id: 1,
          label: 'Jefes',
          color: 'blue',
          percent: bosses,
        },
        {
          id: 2,
          label: '',
          color: 'lightblue',
          percent: 100 - bosses,
        },
      ],
      [
        {
          id: 1,
          label: 'Archis',
          color: 'green',
          percent: archis,
        },
        {
          id: 2,
          label: 'Archis',
          color: 'lightgreen',
          percent: 100 - archis,
        },
      ],
      [
        {
          id: 1,
          label: 'Total',
          color: 'yellow',
          percent: total,
        },
        {
          id: 4,
          label: 'Total',
          color: 'lightyellow',
          percent: 100 - total,
        },
      ],
    ];
  }

  private calculatePercentage(current: number, total: number): number {
    return Number(((current / total) * 100).toFixed(2)) || 0;
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
  }
}

// SwitchMap cancels previous requests and only perform the last one
// MergeMap performs all requests in parallel
// ConcatMap Performs all requests in sequence
// ExhaustMap cancels last requests until first request is finished
