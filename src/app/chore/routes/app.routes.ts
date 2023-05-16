import { inject } from '@angular/core';
import { Route, UrlSegment } from '@angular/router';
import { LanguageConfig } from 'providers/language-provider';
import { loginPath } from './paths/login.path';
import { notFoundPath } from './paths/not-found.path';

export const appRoutes: Route[] = [
  loginPath,
  {
    path: '',
    redirectTo: '/es',
    pathMatch: 'full',
  },
  {
    path: ':language',
    canMatch: [
      (_route: Route, segments: UrlSegment[]) =>
        inject(LanguageConfig).supportedLanguages.includes(segments[0].path),
    ],
    loadChildren: () =>
      import('@chore/routes/language.routes').then((m) => m.configureRoutes()),
  },
  notFoundPath,
];
