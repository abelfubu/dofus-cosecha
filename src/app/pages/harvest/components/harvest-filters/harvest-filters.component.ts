import { CommonModule } from '@angular/common';
import { Component, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, tap } from 'rxjs';
import { ChartComponent } from 'src/app/shared/chart/chart.component';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { InputComponent } from 'src/app/shared/ui/input/input.component';
import { HarvestFilters, HarvestStore } from '../../harvest.store';
import { DEFAULT_FILTERS } from './filters-data';

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

  data$ = this.harvestStore.statistics$;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly harvestStore: HarvestStore
  ) {}

  ngOnInit(): void {
    this.harvestStore.filter(
      this.form.valueChanges.pipe(map(this.mapToHarvestFilters))
    );
  }

  onClearFilters(): void {
    this.form.setValue(DEFAULT_FILTERS);
    this.search.setValue('');
  }

  private mapToHarvestFilters({
    search: _search,
    ...values
  }: Omit<Partial<HarvestFilters>, 'steps'>): Omit<
    Partial<HarvestFilters>,
    'search' | 'steps'
  > {
    return values;
  }
}
