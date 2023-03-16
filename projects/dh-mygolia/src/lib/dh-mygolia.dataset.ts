export type DhMygoliaFilters = Record<string, unknown>;

export type DhMygoliaValidatorFn<T> = (
  item: T,
  filters: DhMygoliaFilters,
) => void | Error;

export interface DhMygoliaDatasetConfig<T> {
  dataSet: T[];
  maxResults?: number;
  validators?: DhMygoliaValidatorFn<T>[];
}

export interface DhMygoliaResponse<T> {
  dataSet: T[];
  pages: number;
  next: number | null;
  previous: number | null;
}

export class DhMygoliaDataset<T> {
  private readonly dataSet: T[];
  maxResults: number;
  validators: Function[];

  constructor(config: DhMygoliaDatasetConfig<T>) {
    this.dataSet = config.dataSet;
    this.maxResults = config.maxResults || 12;
    this.validators = config.validators || [];
  }

  getDataSet(page = 0, filters: DhMygoliaFilters): DhMygoliaResponse<T> {
    const dataSet = this.filterDataset(filters);
    const pages = Math.ceil(dataSet.length / this.maxResults);
    const next = page + 1 < pages ? page + 1 : null;
    const previous = page > 0 ? page - 1 : null;

    return {
      pages,
      next,
      previous,
      dataSet: dataSet.slice(page * this.maxResults, (page + 1) * this.maxResults),
    };
  }

  private filterDataset(filters: DhMygoliaFilters): T[] {
    return this.dataSet.reduce<T[]>((acc, item) => {
      try {
        this.validators.forEach((validator) => validator(item, filters));
        acc.push(item);
      } catch {
        void null;
      }

      return acc;
    }, []);
  }
}
