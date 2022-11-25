import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HarvestStore } from '../../harvest.store';
import { Harvest } from '../../models/harvest';

@Component({
  selector: 'app-harvest-item',
  templateUrl: './harvest-item.component.html',
  styleUrls: ['./harvest-item.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HarvestItemComponent implements OnInit {
  @Input() item!: Harvest;

  amount = new FormControl(0);

  constructor(private readonly harvestStore: HarvestStore) {}

  ngOnInit(): void {
    this.amount.valueChanges.subscribe((value) => {
      this.harvestStore.amount({ ...this.item, amount: value ?? 0 });
    });
  }

  onCapturedChange(item: Harvest): void {
    this.harvestStore.capture(item);
  }
}
