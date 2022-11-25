import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'harvest',
    pathMatch: 'full',
  },
  {
    path: 'harvest',
    loadComponent: () =>
      import('./pages/harvest/havest.component').then((c) => c.HavestComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
