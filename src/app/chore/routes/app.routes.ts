import { Route } from '@angular/router';
import { harvestPath } from './paths/harvest.path';
import { loginPath } from './paths/login.path';
import { notFoundPath } from './paths/not-found.path';
import { sharePath } from './paths/share.path';

export const appRoutes: Route[] = [loginPath, harvestPath, sharePath, notFoundPath];
