import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { HarvestStore } from '../../../harvest.store';
import { HarvestStepModalComponent } from '../../harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { HEADERS } from './header-data';

@Component({
  selector: 'app-harvest-table-header',
  templateUrl: './harvest-table-header.component.html',
  styleUrls: ['./harvest-table-header.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent, HarvestStepModalComponent],
})
export class HarvestTableHeaderComponent {
  readonly headers = HEADERS;

  private readonly matDialog = inject(MatDialog);
  private readonly harvestStore = inject(HarvestStore);

  openFilter<T extends { store: unknown }>(component: ComponentType<T>) {
    const instance = this.matDialog.open(component, {
      panelClass: 'background',
    });
    instance.componentInstance.store = this.harvestStore;
  }
}
