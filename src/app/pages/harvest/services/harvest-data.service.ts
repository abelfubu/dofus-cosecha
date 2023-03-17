import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { UserHarvest } from '../harvest.store';
import { HarvestDataResponse } from '../models/harvest-data.response';

@Injectable({
  providedIn: 'root',
})
export class HarvestDataService {
  private readonly URL = environment.apiUrl;
  private readonly http = inject(HttpClient);

  get(id: string): Observable<HarvestDataResponse> {
    return this.http.get<HarvestDataResponse>(`${this.URL}/harvest/${id ?? ''}`);
  }

  update(data: UserHarvest): Observable<void> {
    return this.http.post<void>(`${this.URL}/harvest`, data);
  }

  completeSteps(steps: Record<number, boolean>): Observable<HarvestDataResponse> {
    return this.http.post<HarvestDataResponse>(`${this.URL}/harvest/complete`, { steps });
  }
}
