import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { HarvestStepModalComponent } from '../../harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { HEADERS } from './header-data';

@Component({
  selector: 'app-harvest-table-header',
  templateUrl: './harvest-table-header.component.html',
  styleUrls: ['./harvest-table-header.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent],
})
export class HarvestTableHeaderComponent {
  readonly headers = HEADERS;

  constructor(private readonly matDialog: MatDialog) {}

  openFilter<T>(component: ComponentType<T>) {
    this.matDialog.open(component, { panelClass: 'background' });
  }
}
