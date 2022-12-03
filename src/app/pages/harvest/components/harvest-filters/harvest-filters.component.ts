import { CommonModule } from '@angular/common';
import { Component, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, tap } from 'rxjs';
import { ChartComponent } from 'src/app/shared/chart/chart.component';
import { InputComponent } from 'src/app/shared/ui/input/input.component';
import { HarvestStore } from '../../harvest.store';

@Component({
  selector: 'app-harvest-filters',
  templateUrl: './harvest-filters.component.html',
  styleUrls: ['./harvest-filters.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChartComponent, InputComponent],
})
export class HarvestFiltersComponent {
  form = this.formBuilder.group({
    search: [],
    completed: [true],
    repeated: [false],
  });

  @Output() changed = this.form.controls.search.valueChanges.pipe(
    debounceTime(800)
  );

  data$ = this.harvestStore.statistics$;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly harvestStore: HarvestStore
  ) {}

  ngOnInit(): void {
    this.harvestStore.completed(this.form.controls.completed.valueChanges);
    this.harvestStore.repeated(this.form.controls.repeated.valueChanges);
  }
}
