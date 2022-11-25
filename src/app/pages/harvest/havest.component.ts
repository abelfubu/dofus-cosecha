import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HarvestFiltersComponent } from './components/harvest-filters/harvest-filters.component';
import { HarvestTableComponent } from './components/harvest-table/harvest-table.component';
import { HarvestStore } from './harvest.store';

@Component({
  selector: 'app-havest',
  templateUrl: './havest.component.html',
  styleUrls: ['./havest.component.scss'],
  standalone: true,
  imports: [CommonModule, HarvestTableComponent, HarvestFiltersComponent],
  providers: [HarvestStore],
})
export class HavestComponent implements OnInit {
  data$ = this.harvestStore.harvest$;

  constructor(private readonly harvestStore: HarvestStore) {}

  ngOnInit(): void {
    this.harvestStore.getData();
  }

  onSearchChange(search: string | null): void {
    this.harvestStore.search(search);
  }
}
