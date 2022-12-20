import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, take, tap } from 'rxjs';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { HarvestStore } from '../../../harvest.store';
import { HarvestSteps } from '../../../models/harvest-steps';

@Component({
  selector: 'app-harvest-step-modal',
  templateUrl: './harvest-step-modal.component.html',
  styleUrls: ['./harvest-step-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
})
export class HarvestStepModalComponent {
  form!: FormGroup;
  store!: HarvestStore;
  steps$!: Observable<boolean[]>;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.steps$ = this.store.steps$.pipe(
      take(1),
      tap((steps) => this.initializeStepsForm(steps))
    );
  }

  setAllControls(steps: boolean[], value: boolean): void {
    this.form.setValue(HarvestSteps.mapToFormValue(steps, value));
  }

  private initializeStepsForm(steps: boolean[]): void {
    this.form = this.formBuilder.group(HarvestSteps.mapToFormGroup(steps));
    this.store.steps(this.form.valueChanges);
  }
}
