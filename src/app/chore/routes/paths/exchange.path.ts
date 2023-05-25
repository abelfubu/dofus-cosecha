import { inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { tap } from 'rxjs';
import { GlobalStore } from '../../../shared/store/global.store';

export const exchangePath: Route = {
  path: 'exchange',
  canActivate: [
    () => {
      const router = inject(Router);
      return inject(GlobalStore).isLoggedIn$.pipe(
        tap((isLoggedIn) => {
          if (!isLoggedIn) {
            router.navigate(['/login']);
          }
        }),
      );
    },
  ],
  loadComponent: () =>
    import('@pages/exchange/exchange.component').then((c) => c.ExchangeComponent),
};
