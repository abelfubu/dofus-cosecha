import { Component, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { HarvestStore } from '../../harvest.store';

@Component({
  selector: 'app-harvest-filters',
  templateUrl: './harvest-filters.component.html',
  styleUrls: ['./harvest-filters.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class HarvestFiltersComponent {
  form = this.formBuilder.group({
    search: [],
    completed: [true],
  });

  @Output() changed = this.form.controls.search.valueChanges.pipe(
    debounceTime(800)
  );

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly harvestStore: HarvestStore
  ) {}

  ngOnInit(): void {
    this.harvestStore.completed(this.form.controls.completed.valueChanges);
  }
}
