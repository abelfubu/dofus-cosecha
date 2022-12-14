import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalStore } from 'src/app/shared/store/global.store';
import { HeaderComponent } from 'src/app/shared/ui/header/header.component';
import { HarvestFiltersComponent } from './components/harvest-filters/harvest-filters.component';
import { HarvestStepModalComponent } from './components/harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { HarvestTableComponent } from './components/harvest-table/harvest-table.component';
import { HarvestStore } from './harvest.store';
import { Harvest } from './models/harvest';
import { HarvestFilter } from './services/harvest-filter';
import { CHART_TYPE_PROVIDER } from './tokens/chart-type-data.token';
import { HARVEST_FILTER_PROVIDER } from './tokens/harvest-filter.token';

const HARVEST_DATA = new InjectionToken<Observable<Harvest[]>>('HARVEST_DATA');
export const EDITABLE = new InjectionToken<Observable<boolean>>('EDITABLE');

@Component({
  selector: 'app-havest',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    HeaderComponent,
    HarvestTableComponent,
    HarvestFiltersComponent,
    HarvestStepModalComponent,
  ],
  providers: [
    HARVEST_FILTER_PROVIDER,
    CHART_TYPE_PROVIDER,
    HarvestFilter,
    HarvestStore,
    {
      provide: HARVEST_DATA,
      useFactory: (store: HarvestStore) => store.harvest$,
      deps: [HarvestStore],
    },
    {
      provide: EDITABLE,
      useFactory: (route: ActivatedRoute) => !route.snapshot.params['id'],
      deps: [ActivatedRoute],
    },
  ],
  template: `
    <app-header (logout)="onLogout()"></app-header>
    <app-harvest-filters
      (changed)="onSearchChange($event)"
    ></app-harvest-filters>
    <app-harvest-table [data]="data$ | async"></app-harvest-table>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 95vw;
        margin: auto;
      }
    `,
  ],
})
export class HarvestComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly globalStore: GlobalStore,
    private readonly harvestStore: HarvestStore,
    @Inject(EDITABLE) public editable: boolean,
    @Inject(HARVEST_DATA) public data$: Observable<Harvest[]>
  ) {}

  ngOnInit(): void {
    this.harvestStore.getData(this.route.snapshot.params['id']);
  }

  onSearchChange(search: string): void {
    this.harvestStore.search(search);
  }

  onLogout(): void {
    this.globalStore.logout();
    this.harvestStore.getData(this.route.snapshot.params['id']);
  }
}
