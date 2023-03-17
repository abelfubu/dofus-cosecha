import { CommonModule } from '@angular/common';
import { Component, inject, InjectionToken, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterLinkWithHref } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { HarvestStepModalComponent } from '@pages/harvest/components/harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { ChartSlice } from '@shared/chart/chart.model';
import { combineLatest, debounceTime, from, map, Observable } from 'rxjs';
import { ChartComponent } from 'src/app/shared/chart/chart.component';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { InputComponent } from 'src/app/shared/ui/input/input.component';
import { environment } from '../../../../../environments/environment';
import { HarvestStore } from '../../harvest.store';
import { DEFAULT_FILTERS } from './filters-data';

export const HARVEST_FILTERS_VM = new InjectionToken<Observable<HarvestFiltersVM>>(
  'HARVEST_FILTERS_VM',
);
interface HarvestFiltersVM {
  statistics: ChartSlice[][];
  harvestId: string;
  steps: boolean[];
}

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
    RouterLinkWithHref,
    HarvestStepModalComponent,
  ],
  providers: [
    {
      provide: HARVEST_FILTERS_VM,
      useFactory: () => {
        const store = inject(HarvestStore);
        return combineLatest([store.statistics$, store.harvestId$, store.steps$]).pipe(
          map(([statistics, harvestId, steps]) => ({
            statistics,
            harvestId,
            steps,
          })),
        );
      },
    },
  ],
})
export class HarvestFiltersComponent {
  search = new FormControl('');

  @Output() changed = this.search.valueChanges.pipe(debounceTime(400), map(String));

  private readonly toast = inject(HotToastService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly harvestStore = inject(HarvestStore);
  protected readonly vm$ = inject(HARVEST_FILTERS_VM);
  private readonly matDialog = inject(MatDialog);

  form = this.formBuilder.nonNullable.group({
    showCaptured: [true],
    showRepeatedOnly: [false],
    monsters: [true],
    bosses: [true],
    archis: [true],
  });

  ngOnInit(): void {
    this.harvestStore.filter(this.form.valueChanges);
  }

  onClearFilters(): void {
    this.form.setValue(DEFAULT_FILTERS);
    this.search.setValue('');
  }

  onShareHarvest(id: string) {
    from(navigator.clipboard.writeText(`${environment.baseUrl}/share/${id}`))
      .pipe(
        this.toast.observe({
          loading: 'Copiando url en el portapapeles',
          success: 'Enlace copiado en el portapapeles',
          error: 'Algo ha ido mal, intentalo más tarde',
        }),
      )
      .subscribe();
  }

  onStepCompleted(steps: boolean[]): void {
    this.harvestStore.completeSteps(
      this.matDialog
        .open(HarvestStepModalComponent, { data: steps, panelClass: 'background' })
        .afterClosed(),
    );
  }
}
