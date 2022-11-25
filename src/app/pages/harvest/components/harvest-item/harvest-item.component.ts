import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HarvestStore } from '../../harvest.store';
import { Harvest } from '../../models/harvest';

@Component({
  selector: 'app-harvest-item',
  templateUrl: './harvest-item.component.html',
  styleUrls: ['./harvest-item.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HarvestItemComponent {
  @Input() item!: Harvest;

  constructor(private readonly harvestStore: HarvestStore) {}

  onCapturedChange({ id, captured, amount }: Harvest): void {
    this.harvestStore.update({ id, captured: !captured, amount: amount ?? 0 });
  }

  onAmountChange({ id, captured }: Harvest, amount: number): void {
    this.harvestStore.update({ id, captured, amount });
  }
}
