import { Inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';

import { HarvestDataService } from './services/harvest-data.service';

import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { ChartSlice } from 'src/app/shared/chart/chart.model';
import { GlobalStore } from 'src/app/shared/store/global.store';
import { Harvest, HarvestType } from './models/harvest';
import { ChartData, CHART_TYPE_DATA } from './tokens/chart-type-data.token';
import { MathUtils } from 'src/app/utils/math.utils';
import { StringUtils } from 'src/app/utils/string.utils';

export type UserHarvest = Pick<Harvest, 'id' | 'captured' | 'amount'>;

export interface HarvestFilters {
  showCaptured: boolean | undefined;
  showRepeatedOnly: boolean | undefined;
  search: string | undefined | null;
  steps: boolean[];
  monsters: boolean | undefined;
  bosses: boolean | undefined;
  archis: boolean | undefined;
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
    monsters: true,
    bosses: true,
    archis: true,
  },
};

@Injectable()
export class HarvestStore extends ComponentStore<HarvestData> {
  constructor(
    private readonly router: Router,
    private readonly globalStore: GlobalStore,
    @Inject(CHART_TYPE_DATA) private chartData: ChartData,
    private readonly harvestDataService: HarvestDataService
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
            (data) => this.setData(data),
            (error) => console.log(error)
          )
        )
      )
    )
  );

  readonly updateData = this.effect((trigger$: Observable<UserHarvest>) =>
    trigger$.pipe(
      switchMap((item) =>
        this.globalStore.isLoggedIn$.pipe(map((logged) => ({ logged, item })))
      ),
      tap(
        ({ logged }) =>
          !logged &&
          this.router.navigate(['/login'], { queryParams: { from: 'harvest' } })
      ),
      filter(Boolean),
      map(({ item }) => ({
        item,
        itemBefore: this.get().originalData.find((i) => i.id === item.id),
      })),
      tap((data) => this.update(data.item)),
      mergeMap((data) =>
        this.harvestDataService.update(data.item).pipe(
          catchError(() => {
            this.update(data.itemBefore!);
            return EMPTY;
          })
        )
      )
    )
  );

  readonly setData = this.updater((state, data: Harvest[]) => {
    return {
      ...state,
      statistics: this.calculateStatistics(data),
      originalData: data,
      harvest: data,
    };
  });

  readonly search = this.updater((state, search: string | null) => {
    const filters = { ...state.filters, search };

    return {
      ...state,
      filters,
      harvest: this.applyFilters(state.originalData, filters),
    };
  });

  readonly filter = this.updater(
    (state, values: Omit<Partial<HarvestFilters>, 'steps' | 'search'>) => {
      const filters = { ...state.filters, ...values };
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
      try {
        showRepeatedOnly(item, filters);
        showCaptured(item, filters);
        steps(item, filters);
        filterMonsters(item, filters);
        filterBosses(item, filters);
        filterArchis(item, filters);
        filterSearch(item, filters);
        acc.push(item);
      } catch {}

      return acc;
    }, []);
  }

  private calculateStatistics(data: Harvest[]): ChartSlice[][] {
    return this.chartData.map(
      ({ amount, colors: [c1, c2], label, callback }) => {
        const current = data.filter(callback).length;
        const percent = MathUtils.calculatePercentage(current, amount);

        return [
          {
            id: 1,
            amount,
            current,
            label: label,
            percent: percent,
            color: c1,
          },
          {
            id: 2,
            color: c2,
            percent: 100 - percent,
          },
        ];
      }
    );
  }
}

// SwitchMap cancels previous requests and only perform the last one
// MergeMap performs all requests in parallel
// ConcatMap Performs all requests in sequence
// ExhaustMap cancels last requests until first request is finished

function showRepeatedOnly(item: Harvest, filters: HarvestFilters) {
  if (filters.showRepeatedOnly && !item.amount) {
    throw new Error('Repeated Only');
  }
}

function showCaptured(item: Harvest, filters: HarvestFilters) {
  if (!filters.showCaptured && item.captured) {
    throw new Error('Show Captured');
  }
}

function steps(item: Harvest, filters: HarvestFilters) {
  if (!filters.steps[item.step - 1]) {
    throw new Error('Steps');
  }
}

function filterMonsters(item: Harvest, filters: HarvestFilters) {
  if (!filters.monsters && item.type === HarvestType.MONSTER) {
    throw new Error('Filter Monsters');
  }
}

function filterBosses(item: Harvest, filters: HarvestFilters) {
  if (!filters.bosses && item.type === HarvestType.BOSS) {
    throw new Error('Filter Bosses');
  }
}

function filterArchis(item: Harvest, filters: HarvestFilters) {
  if (!filters.archis && item.type === HarvestType.ARCHI) {
    throw new Error('Filter Archis');
  }
}

function filterSearch(item: Harvest, filters: HarvestFilters) {
  const { name, zone, subzone } = item;

  if (
    filters.search &&
    !Object.values({ name, zone, subzone })
      .map((value) => StringUtils.normalize(value))
      .some((value) => value.includes(StringUtils.normalize(filters.search!)))
  ) {
    throw new Error('Filter Search');
  }
}
