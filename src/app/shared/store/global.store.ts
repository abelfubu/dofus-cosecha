import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Credentials } from '../models/credentials';
import { User } from '../models/user';
import { LocalStorageService } from '../services/local-storage.service';
import { LoginService } from '../services/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { GtmTrackingService } from '../../chore/services/gtm-tracking.service';
import { LoginSuccessEvent } from '../../chore/tracking/gtm/login-success.event';

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
    private readonly router: Router,
    private readonly toast: HotToastService,
    private readonly loginService: LoginService,
    private readonly gtmTracking: GtmTrackingService,
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
            (response) => {
              this.router.navigate(['/']);
              this.toast.success('Bienvenido!');
              this.setLoggedIn(response);
            },
            (error) => this.toast.error(String(error))
          )
        )
      )
    )
  );

  readonly logout = this.updater((state) => {
    this.localStorageService.remove(this.AUTH_KEY);

    return { ...state, isLoggedIn: false, user: null };
  });

  private readonly _setLoggedIn = this.updater(
    (state, { accessToken }: AuthResponse) => {
      this.localStorageService.set(this.AUTH_KEY, accessToken);
      const helper = new JwtHelperService();
      const user = helper.decodeToken(accessToken);
      this.gtmTracking.setGlobalProperties({ user });
      this.gtmTracking.track(new LoginSuccessEvent());

      return { ...state, isLoggedIn: !!accessToken, user };
    }
  );
  public get setLoggedIn() {
    return this._setLoggedIn;
  }
}
