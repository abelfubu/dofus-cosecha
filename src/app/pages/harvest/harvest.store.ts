import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { HarvestDataService } from './services/harvest-data.service';

import { Harvest, HarvestType } from './models/harvest';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ChartSlice } from 'src/app/shared/chart/chart.model';
import { EMPTY, Observable } from 'rxjs';

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
  userData: Record<string, Harvest>;
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

  readonly updateData = this.effect((trigger$: Observable<UserHarvest>) =>
    trigger$.pipe(
      map((item) => ({
        item,
        itemBefore: this.get().originalData.find((i) => i.id === item.id),
      })),
      tap((data) => this.update(data.item)),
      mergeMap((data) =>
        this.harvestDataService.update(data.item).pipe(
          catchError((error) => {
            this.update(data.itemBefore!);
            console.log(error);
            return EMPTY;
          })
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

      const harvest = this.applyFilters(state.originalData, filters);

      return { ...state, filters, harvest };
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
    // const storage = this.localStorageService.update<Partial<Harvest>>(
    //   this.DOFUS_HARVEST_KEY,
    //   item.id,
    //   item
    // );

    const callback = (i: Harvest) => (i.id === item.id ? { ...i, ...item } : i);

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
      if (filters.showRepeatedOnly && !item.amount) {
        return acc;
      }

      if (!filters.showCaptured && item.captured) {
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
    const dataMap: Record<number, { label: string; colors: string[] }> = {
      [HarvestType.MONSTER]: {
        label: 'Monstruos',
        colors: ['#8E24AA', '#BA68C877'],
      },
      [HarvestType.BOSS]: { label: 'Jefes', colors: ['#00ACC1', '#4DD0E177'] },
      [HarvestType.ARCHI]: {
        label: 'Archis',
        colors: ['#C0CA33', '#DCE77577'],
      },
      3: { label: 'Total', colors: ['#FFB300', '#FFD54F77'] },
    };
    // const [monsters, bosses, archis] = [
    return [
      { type: HarvestType.MONSTER, amount: 299 },
      { type: HarvestType.BOSS, amount: 51 },
      { type: HarvestType.ARCHI, amount: 286 },
      { type: 3, amount: data.length },
    ].map(({ type, amount }) => {
      const percent =
        this.calculatePercentage(
          type !== 3
            ? data.filter((item) => item.captured && item.type === type).length
            : data.filter((item) => item.captured).length,
          amount
        ) || 0.001;
      return [
        {
          id: 1,
          label: dataMap[type].label,
          color: dataMap[type].colors.at(0)!,
          percent: percent,
        },
        {
          id: 2,
          label: dataMap[type].label,
          color: dataMap[type].colors.at(1)!,
          percent: 100 - percent,
        },
      ];
    });
  }

  private calculatePercentage(current: number, total: number): number {
    return Number((current / total) * 100) || 0;
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
