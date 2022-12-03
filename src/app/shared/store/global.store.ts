import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Credentials } from '../models/credentials';
import { LocalStorageService } from '../services/local-storage.service';
import { LoginService } from '../services/login.service';

export interface GlobalState {
  currentHarvestId: string;
  isLoggedIn: boolean;
}

const DEFAULT_STATE: GlobalState = {
  currentHarvestId: '',
  isLoggedIn: false,
};

@Injectable({
  providedIn: 'root',
})
export class GlobalStore extends ComponentStore<GlobalState> {
  private readonly AUTH_KEY = environment.authKey;

  constructor(
    private readonly loginService: LoginService,
    private readonly localStorageService: LocalStorageService
  ) {
    super({
      ...DEFAULT_STATE,
      isLoggedIn: !!localStorageService.get(environment.authKey),
    });
  }

  readonly isLoggedIn$ = this.select(({ isLoggedIn }) => isLoggedIn);

  readonly login = this.effect<Credentials>((trigger$) =>
    trigger$.pipe(
      switchMap((credentials) =>
        this.loginService.login(credentials).pipe(
          tapResponse(
            (response) => this.setLoggedIn(response),
            (error) => console.log(error)
          )
        )
      )
    )
  );

  readonly logout = this.updater((state) => {
    this.localStorageService.remove(this.AUTH_KEY);

    return {
      ...state,
      isLoggedIn: false,
    };
  });

  readonly setLoggedIn = this.updater(
    (state, { accessToken }: AuthResponse) => {
      this.localStorageService.set(this.AUTH_KEY, accessToken);

      return {
        ...state,
        isLoggedIn: true,
      };
    }
  );
}

// SwitchMap cancels previous requests and only perform the last one
// MergeMap performs all requests in parallel
// ConcatMap Performs all requests in sequence
// ExhaustMap cancels last requests until first request is finished
