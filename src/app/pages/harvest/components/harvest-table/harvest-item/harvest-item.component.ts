import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { EDITABLE } from '../../../harvest.component';
import { HarvestStore } from '../../../harvest.store';
import { Harvest } from '../../../models/harvest';

@Component({
  selector: 'app-harvest-item',
  templateUrl: './harvest-item.component.html',
  styleUrls: ['./harvest-item.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HarvestItemComponent {
  @Input() item!: Harvest;

  constructor(
    private readonly harvestStore: HarvestStore,
    @Inject(EDITABLE) public editable: boolean
  ) {}

  onCapturedChange({ id, captured, amount = 0 }: Harvest): void {
    this.harvestStore.updateData({
      id,
      captured: !captured,
      amount: amount,
    });
  }

  onAmountChange({ id, captured }: Harvest, amount: number): void {
    this.harvestStore.updateData({ id, captured: !!captured, amount });
  }
}
