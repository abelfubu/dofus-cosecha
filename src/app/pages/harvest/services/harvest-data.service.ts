import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserHarvest } from '../harvest.store';
import { Harvest } from '../models/harvest';

@Injectable({
  providedIn: 'root',
})
export class HarvestDataService {
  private readonly URL = environment.apiUrl;
  private harvestId: string = '';

  constructor(private readonly http: HttpClient) {}

  get(): Observable<Harvest[]> {
    return this.http
      .get<{ harvest: Harvest[]; harvestId: string }>(`${this.URL}/harvest`)
      .pipe(
        map((response) => {
          this.harvestId = response.harvestId;
          return response.harvest;
        })
      );
  }

  update(data: UserHarvest): Observable<void> {
    return this.http.post<void>(`${this.URL}/harvest`, {
      harvestId: this.harvestId,
      ...data,
    });
  }
}
