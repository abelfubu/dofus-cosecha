import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ChartSlice } from './chart.model';
import { ChartPipe } from './chart.pipe';

@Component({
  selector: 'app-chart',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ChartPipe],
  template: `
    <svg [attr.viewBox]="'0 0 ' + viewBox + ' ' + viewBox" *ngIf="data">
      <path
        *ngFor="
          let slice of data | chartPipe: radius:viewBox:borderSize;
          trackBy: trackByFn;
          let index = index
        "
        [attr.fill]="slice.color"
        [attr.d]="slice.commands"
        [attr.transform]="'rotate(' + slice.offset + ')'"
        (click)="slice.onClickCb ? slice.onClickCb() : null"
      >
        <title>{{ slice.label }}</title>
      </path>
    </svg>
    <p style="position: relative; top: -50%; text-align: center">
      {{ data[0].label }} {{ data[0].percent }}%
    </p>
  `,
})
export class ChartComponent implements OnInit {
  @Input() radius = 50;
  @Input() viewBox = 100;
  @Input() borderSize = 15;
  @Input() data: ChartSlice[] = [];

  ngOnInit() {
    const sum = this.data?.reduce((accu, slice) => accu + slice.percent, 0);
    if (sum !== 100) {
      throw new Error(
        `The sum of all slices of the donut chart must equal to 100%. Found: ${sum}.`
      );
    }
  }

  trackByFn(_index: number, slice: ChartSlice) {
    return slice.id;
  }
}
