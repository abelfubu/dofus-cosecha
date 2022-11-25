import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs/operators';

import { HarvestDataService } from './services/harvest-data.service';

import { Harvest } from './models/harvest';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

export interface HarvestData {
  originalData: Harvest[];
  harvest: Harvest[];
}

const DEFAULT_STATE: HarvestData = {
  originalData: [],
  harvest: [],
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
    harvest: search
      ? state.originalData.filter((item) =>
          Object.values(item)
            .filter((value) => typeof value === 'string')
            .map((value) => this.normalize(value))
            .some((value) => value.includes(this.normalize(search)))
        )
      : state.originalData,
  }));

  readonly capture = this.updater((state, item: Harvest) => {
    const storage =
      this.localStorageService.get<Record<number, Partial<Harvest>>>(
        this.DOFUS_HARVEST_KEY
      ) ?? {};

    storage[item.id] = { captured: !item.captured, amount: item?.amount ?? 0 };

    this.localStorageService.set(this.DOFUS_HARVEST_KEY, storage);

    const callback = (i: Harvest) =>
      i.id === item.id ? { ...item, ...storage[item.id] } : i;

    return {
      originalData: state.originalData.map(callback),
      harvest: state.harvest.map(callback),
    };
  });

  readonly amount = this.updater((state, item: Harvest) => {
    return { ...state };
  });

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
