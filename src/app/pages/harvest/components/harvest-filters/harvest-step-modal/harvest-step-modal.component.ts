import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { HarvestStore } from '../../../harvest.store';

@Component({
  selector: 'app-harvest-step-modal',
  templateUrl: './harvest-step-modal.component.html',
  styleUrls: ['./harvest-step-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class HarvestStepModalComponent {
  form!: FormGroup;
  steps!: boolean[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly harvestStore: HarvestStore
  ) {}

  ngOnInit(): void {
    this.harvestStore.steps$.pipe(take(1)).subscribe((steps) => {
      this.steps = steps;
      this.form = this.formBuilder.group(
        steps.reduce<Record<number, [boolean]>>((acc, value, index) => {
          acc[index + 1] = [value];
          return acc;
        }, {})
      );
    });

    this.harvestStore.steps(this.form.valueChanges);
  }

  setAllControls(value: boolean): void {
    const formValue = this.steps.reduce<Record<number, boolean>>(
      (acc, _value, index) => {
        acc[index + 1] = value;
        return acc;
      },
      {}
    );

    this.form.setValue(formValue);
  }
}
