import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs/operators';

import { HarvestDataService } from './services/harvest-data.service';

import { Harvest } from './models/harvest';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

export type UserHarvest = Pick<Harvest, 'id' | 'captured' | 'amount'>;

export interface HarvestFilters {
  showCompleted: boolean;
  search: string | null;
}

export interface HarvestData {
  originalData: Harvest[];
  harvest: Harvest[];
  filters: HarvestFilters;
}

const DEFAULT_STATE: HarvestData = {
  originalData: [],
  harvest: [],
  filters: { showCompleted: true, search: null },
};

interface GetDataResponse {
  data: Harvest[];
  userData: Record<number, Harvest>;
}

@Injectable()
export class HarvestStore extends ComponentStore<HarvestData> {
  private readonly DOFUS_HARVEST_KEY = 'dof.harv';

  constructor(
    private readonly harvestDataService: HarvestDataService,
    private readonly localStorageService: LocalStorageService
  ) {
    super(DEFAULT_STATE);
  }

  readonly harvest$ = this.select(({ harvest }) => harvest);

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
        originalData: mappedData,
        harvest: mappedData,
      };
    }
  );

  readonly search = this.updater((state, search: string | null) => ({
    ...state,
    filters: { ...state.filters, search },
    harvest: this.applyFilters(state.originalData, {
      ...state.filters,
      search,
    }),
  }));

  readonly completed = this.updater((state, showCompleted: boolean | null) => ({
    ...state,
    filters: { ...state.filters, showCompleted: !!showCompleted },
    harvest: this.applyFilters(state.originalData, {
      ...state.filters,
      showCompleted: !!showCompleted,
    }),
  }));

  readonly update = this.updater((state, item: UserHarvest) => {
    const storage = this.localStorageService.update<Partial<Harvest>>(
      this.DOFUS_HARVEST_KEY,
      item.id,
      item
    );

    const callback = (i: Harvest) =>
      i.id === item.id ? { ...i, ...storage } : i;

    return {
      ...state,
      originalData: state.originalData.map(callback),
      harvest: this.applyFilters(state.harvest.map(callback), state.filters),
    };
  });

  private applyFilters(source: Harvest[], filters: HarvestFilters): Harvest[] {
    return source.reduce<Harvest[]>((acc, item) => {
      if (!filters.showCompleted && item.captured) {
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
