import { CommonModule } from '@angular/common';
import { Component, InjectionToken, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { GlobalStore } from 'src/app/shared/store/global.store';
import { HeaderComponent } from 'src/app/shared/ui/header/header.component';
import { HarvestFiltersComponent } from './components/harvest-filters/harvest-filters.component';
import { HarvestStepModalComponent } from './components/harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { HarvestTableComponent } from './components/harvest-table/harvest-table.component';
import { HarvestStore } from './harvest.store';
import { HarvestType } from './models/harvest';
import {
  CHART_TYPE_DATA,
  CHART_TYPE_PROVIDER,
} from './tokens/chart-type-data.token';

@Component({
  selector: 'app-havest',
  templateUrl: './havest.component.html',
  styleUrls: ['./havest.component.scss'],
  standalone: true,
  providers: [HarvestStore, CHART_TYPE_PROVIDER],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    HeaderComponent,
    HarvestTableComponent,
    HarvestFiltersComponent,
    HarvestStepModalComponent,
  ],
})
export class HavestComponent implements OnInit {
  data$ = this.harvestStore.harvest$;

  constructor(
    private readonly globalStore: GlobalStore,
    private readonly harvestStore: HarvestStore
  ) {}

  ngOnInit(): void {
    this.harvestStore.getData();
  }

  onSearchChange(search: string | null): void {
    this.harvestStore.search(search);
  }

  onLogout(): void {
    this.globalStore.logout();
    this.harvestStore.getData();
  }
}