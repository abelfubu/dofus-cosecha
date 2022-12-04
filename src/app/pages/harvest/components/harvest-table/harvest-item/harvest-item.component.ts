import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { GlobalStore } from 'src/app/shared/store/global.store';
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
export class HarvestItemComponent implements OnInit {
  @Input() item!: Harvest;

  isLoggedIn!: boolean;

  constructor(
    private readonly globalStore: GlobalStore,
    private readonly harvestStore: HarvestStore
  ) {}

  ngOnInit(): void {
    this.globalStore.isLoggedIn$.subscribe((logged) => {
      this.isLoggedIn = logged;
    });
  }

  onCapturedChange({ id, captured, amount }: Harvest): void {
    this.harvestStore.updateData({
      id,
      captured: !captured,
      amount: amount ?? 0,
    });
  }

  onAmountChange({ id, captured }: Harvest, amount: number): void {
    this.harvestStore.updateData({ id, captured: !!captured, amount });
  }
}
