import { Inject, Injectable } from '@angular/core';
import { Harvest } from '../models/harvest';
import {
  Filters,
  HarvestFilterI,
  HARVEST_FILTER,
} from '../tokens/harvest-filter.token';

@Injectable()
export class HarvestFilter {
  constructor(
    @Inject(HARVEST_FILTER) public readonly harvestFilter: HarvestFilterI
  ) {}

  applyFilters(item: Harvest, filters: Filters): void {
    this.harvestFilter.validators.forEach((validator) =>
      validator(item, filters)
    );
  }
}
