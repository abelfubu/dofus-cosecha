import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Harvest } from '../../models/harvest';
import { HarvestFiltersComponent } from '../harvest-filters/harvest-filters.component';
import { HarvestItemComponent } from './harvest-item/harvest-item.component';

@Component({
  selector: 'app-harvest-table',
  templateUrl: './harvest-table.component.html',
  styleUrls: ['./harvest-table.component.scss'],
  standalone: true,
  imports: [CommonModule, HarvestItemComponent],
})
export class HarvestTableComponent {
  @Input() data!: Harvest[] | null;

  constructor(private readonly matDialog: MatDialog) {}

  openFilter(filter: string) {
    this.matDialog.open(HarvestFiltersComponent);
  }
}
