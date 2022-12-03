import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LazyImagesDirective } from 'src/app/shared/lazy-images.directive';

import { Harvest } from '../../models/harvest';
import { HarvestStepModalComponent } from '../harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { HarvestItemComponent } from './harvest-item/harvest-item.component';

@Component({
  selector: 'app-harvest-table',
  templateUrl: './harvest-table.component.html',
  styleUrls: ['./harvest-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HarvestItemComponent,
    LazyImagesDirective,
    MatDialogModule,
  ],
})
export class HarvestTableComponent {
  @Input() data!: Harvest[] | null;

  constructor(private readonly matDialog: MatDialog) {}

  openFilter() {
    this.matDialog.open(HarvestStepModalComponent, {
      panelClass: 'background',
    });
  }

  trackByFn(_index: number, item: Harvest): string {
    return item.id;
  }
}
