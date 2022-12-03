import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Credentials } from '../models/credentials';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login({ provider, ...credentials }: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.URL}/auth/${provider}`,
      credentials
    );
  }
}
