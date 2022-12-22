import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { UserHarvest } from '../harvest.store';
import { HarvestDataResponse } from '../models/harvest-data.response';

@Injectable({
  providedIn: 'root',
})
export class HarvestDataService {
  private readonly URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  get(id: string): Observable<HarvestDataResponse> {
    return this.http.get<HarvestDataResponse>(
      `${this.URL}/harvest/${id ?? ''}`
    );
  }

  update(data: UserHarvest): Observable<void> {
    return this.http.post<void>(`${this.URL}/harvest`, data);
  }
}
