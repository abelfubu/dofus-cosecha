import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Observable } from 'rxjs';
import { ChartComponent } from 'src/app/shared/chart/chart.component';
import { ChartSlice } from 'src/app/shared/chart/chart.model';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { InputComponent } from 'src/app/shared/ui/input/input.component';
import { HarvestStore } from '../../harvest.store';
import { DEFAULT_FILTERS } from './filters-data';

export const HARVEST_STATISTICS = new InjectionToken<
  Observable<ChartSlice[][]>
>('HARVEST_STATISTICS');

@Component({
  selector: 'app-harvest-filters',
  templateUrl: './harvest-filters.component.html',
  styleUrls: ['./harvest-filters.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartComponent,
    InputComponent,
    ButtonComponent,
  ],
  providers: [
    {
      provide: HARVEST_STATISTICS,
      useFactory: (store: HarvestStore) => store.statistics$,
      deps: [HarvestStore],
    },
  ],
})
export class HarvestFiltersComponent {
  search = new FormControl('');

  form = this.formBuilder.nonNullable.group({
    showCaptured: [true],
    showRepeatedOnly: [false],
    monsters: [true],
    bosses: [true],
    archis: [true],
  });

  @Output() changed = this.search.valueChanges.pipe(debounceTime(400));

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly harvestStore: HarvestStore,
    @Inject(HARVEST_STATISTICS) public data$: Observable<ChartSlice[][]>
  ) {}

  ngOnInit(): void {
    this.harvestStore.filter(this.form.valueChanges);
  }

  onClearFilters(): void {
    this.form.setValue(DEFAULT_FILTERS);
    this.search.setValue('');
  }
}
