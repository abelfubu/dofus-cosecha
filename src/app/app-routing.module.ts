import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/harvest/harvest.component').then(
        (c) => c.HarvestComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/harvest/harvest.component').then(
        (c) => c.HarvestComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
