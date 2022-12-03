import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Credentials } from '../models/credentials';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly URL = environment.apiUrl;
  private readonly DFHV_KEY = environment.authKey;

  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService
  ) {}

  login({ provider, ...credentials }: Credentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.URL}/auth/${provider}`, credentials)
      .pipe(
        tap((response) => {
          this.localStorageService.set(this.DFHV_KEY, response.accessToken);
        })
      );
  }
}
