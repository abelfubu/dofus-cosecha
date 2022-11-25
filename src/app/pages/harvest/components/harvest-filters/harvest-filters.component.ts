import { Component, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

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
  });

  @Output() changed = this.form.controls.search.valueChanges.pipe(
    debounceTime(800)
  );

  constructor(private readonly formBuilder: FormBuilder) {}
}
