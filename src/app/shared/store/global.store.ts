import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Credentials } from '../models/credentials';
import { User } from '../models/user';
import { LocalStorageService } from '../services/local-storage.service';
import { LoginService } from '../services/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface GlobalState {
  currentHarvestId: string;
  isLoggedIn: boolean;
  user: User | null;
}

const DEFAULT_STATE: GlobalState = {
  currentHarvestId: '',
  isLoggedIn: false,
  user: null,
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
    super({ ...DEFAULT_STATE, isLoggedIn: false });
  }

  readonly isLoggedIn$ = this.select(({ isLoggedIn }) => isLoggedIn);
  readonly user$ = this.select(({ isLoggedIn, user }) => ({
    ...user,
    isLoggedIn,
  }));

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

    return { ...state, isLoggedIn: false, user: null };
  });

  readonly setLoggedIn = this.updater(
    (state, { accessToken }: AuthResponse) => {
      this.localStorageService.set(this.AUTH_KEY, accessToken);
      const helper = new JwtHelperService();
      const user = helper.decodeToken(accessToken);

      return { ...state, isLoggedIn: !!accessToken, user };
    }
  );
}

// SwitchMap cancels previous requests and only perform the last one
// MergeMap performs all requests in parallel
// ConcatMap Performs all requests in sequence
// ExhaustMap cancels last requests until first request is finished
