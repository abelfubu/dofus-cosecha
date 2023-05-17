import { inject } from '@angular/core';
import { Route, Router, UrlSegment } from '@angular/router';

import { environment } from '@environments/environment';
import { TranslocoService } from '@ngneat/transloco';
import { LoginComponent } from '@pages/login/login.component';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { loginPath } from './paths/login.path';
import { notFoundPath } from './paths/not-found.path';

export const appRoutes: Route[] = [
  loginPath,
  {
    path: '',
    component: LoginComponent,
    canActivate: [
      (_route: Route) => {
        const router = inject(Router);
        const localStorageService = inject(LocalStorageService);
        const translate = inject(TranslocoService);
        const favLang = localStorageService.get(environment.favLangKey);

        if (favLang) {
          router.navigate([favLang]);
          return false;
        }

        const browserLang = navigator.language.split('-').at(0) || 'en';

        if (translate.getAvailableLangs().some((lang) => lang === browserLang)) {
          router.navigate([browserLang]);
          return false;
        }

        return false;
      },
    ],
  },
  {
    path: ':language',
    canMatch: [
      (_route: Route, segments: UrlSegment[]) => {
        const translate = inject(TranslocoService);

        if (translate.getAvailableLangs().some((lang) => lang === segments[0].path)) {
          translate.setActiveLang(segments[0].path);
          return true;
        }

        return false;
      },
    ],
    loadChildren: () =>
      import('@chore/routes/language.routes').then((m) => m.configureRoutes()),
  },
  notFoundPath,
];
