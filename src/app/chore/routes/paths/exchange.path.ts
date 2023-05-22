import { Route } from '@angular/router';

export const exchangePath: Route = {
  path: 'exchange',
  loadComponent: () =>
    import('@pages/exchange/exchange.component').then((c) => c.ExchangeComponent),
} as const;
