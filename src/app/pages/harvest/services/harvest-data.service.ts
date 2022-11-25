import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Harvest } from '../models/harvest';

@Injectable({
  providedIn: 'root',
})
export class HarvestDataService {
  constructor(private readonly http: HttpClient) {}

  get(): Observable<Harvest[]> {
    return this.http.get<Harvest[]>('/assets/harvest-data.json');
  }
}
