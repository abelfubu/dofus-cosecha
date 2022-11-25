import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: 'harvest',
    loadComponent: () =>
      import('./pages/harvest/havest.component').then((c) => c.HavestComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
