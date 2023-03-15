import { inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { catchError, concatMap, filter, map, switchMap, tap } from 'rxjs/operators';

import { HarvestDataService } from './services/harvest-data.service';

import { Router } from '@angular/router';
import { MathUtils } from '@libs/math';
import { HotToastService } from '@ngneat/hot-toast';
import { ChartSlice } from '@shared/chart/chart.model';
import { GlobalStore } from '@shared/store/global.store';
import { EMPTY, Observable } from 'rxjs';
import { Harvest } from './models/harvest';
import { HarvestDataResponse } from './models/harvest-data.response';
import { HarvestFilter } from './services/harvest-filter';
import { CHART_TYPE_DATA } from './tokens/chart-type-data.token';
import { Filters } from './tokens/harvest-filter.token';

export type UserHarvest = Pick<Harvest, 'id' | 'captured' | 'amount'> & {
  harvestId?: string;
};

export interface HarvestData {
  statistics: ChartSlice[][];
  originalData: Harvest[];
  harvest: Harvest[];
  harvestId: string;
  filters: Filters;
}

const DEFAULT_STATE = {
  statistics: [],
  originalData: [],
  harvest: [],
  harvestId: '',
  filters: null,
};

@Injectable()
export class HarvestStore extends ComponentStore<HarvestData> {
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);
  private readonly globalStore = inject(GlobalStore);
  private readonly harvestDataService = inject(HarvestDataService);
  private readonly chartData = inject(CHART_TYPE_DATA);

  constructor(private readonly harvestFilter: HarvestFilter) {
    super({ ...DEFAULT_STATE, filters: harvestFilter.harvestFilter.state });
  }

  readonly harvest$ = this.select(({ harvest }) => harvest);
  readonly harvestId$ = this.select(({ harvestId }) => harvestId);
  readonly steps$ = this.select(({ filters }) => filters?.steps);
  readonly statistics$ = this.select(({ statistics }) => statistics);

  readonly getData = this.effect<string>((id$) =>
    id$.pipe(
      switchMap((id) =>
        this.harvestDataService.get(id).pipe(
          tapResponse(
            (data) => this.setData(data),
            () => {
              this.toast.error('Error en el servidor', { icon: '⚠️' });
              if (id) this.router.navigate(['/']);
            },
          ),
        ),
      ),
    ),
  );

  readonly updateData = this.effect((trigger$: Observable<UserHarvest>) =>
    trigger$.pipe(
      switchMap((item) =>
        this.globalStore.isLoggedIn$.pipe(map((logged) => ({ logged, item }))),
      ),
      tap(
        ({ logged }) =>
          !logged &&
          this.router.navigate(['/login'], { queryParams: { from: 'harvest' } }),
      ),
      filter(Boolean),
      map(({ item }) => ({
        item,
        itemBefore: this.get().originalData.find((i) => i.id === item.id),
      })),
      tap((data) => this.update(data.item)),
      concatMap((data) =>
        this.harvestDataService
          .update({ ...data.item, harvestId: this.get().harvestId })
          .pipe(
            catchError(() => {
              this.update(data.itemBefore!);
              this.toast.error('Algo ha ido mal...');
              return EMPTY;
            }),
          ),
      ),
    ),
  );

  readonly setData = this.updater(
    (state, { harvest, harvestId }: HarvestDataResponse) => ({
      ...state,
      harvest,
      harvestId,
      originalData: harvest,
      statistics: this.calculateStatistics(harvest),
    }),
  );

  readonly search = this.updater((state, search: string) => {
    const filters = { ...state.filters, search };

    return {
      ...state,
      filters,
      harvest: this.applyFilters(state.originalData, filters),
    };
  });

  readonly filter = this.updater(
    (state, values: Omit<Partial<Filters>, 'steps' | 'search'>) => {
      const filters = { ...state.filters, ...values };
      return {
        ...state,
        filters,
        harvest: this.applyFilters(state.originalData, filters),
      };
    },
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
      harvest: this.applyFilters(state.harvest.map(callback), state.filters!),
    };
  });

  private applyFilters(source: Harvest[], filters: Filters): Harvest[] {
    return source.reduce<Harvest[]>((acc, item) => {
      try {
        this.harvestFilter.applyFilters(item, filters);
        acc.push(item);
      } catch {}

      return acc;
    }, []);
  }

  private calculateStatistics(data: Harvest[]): ChartSlice[][] {
    return this.chartData.map(({ amount, colors: [c1, c2], label, callback }) => {
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
    });
  }
}

// SwitchMap cancels previous requests and only perform the last one
// MergeMap performs all requests in parallel
// ConcatMap Performs all requests in sequence
// ExhaustMap cancels last requests until first request is finished
