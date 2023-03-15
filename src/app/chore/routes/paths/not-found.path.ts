import { Route } from '@angular/router';

export const notFoundPath: Route = {
  path: '**',
  redirectTo: '',
  pathMatch: 'full',
} as const;
