import { NgOptimizedImage } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoModule } from '@ngneat/transloco';
import { from } from 'rxjs';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ExchangeResponse } from '../models/exchange.response';

@Component({
  selector: 'app-user-exchange-card',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ButtonComponent, TranslocoModule],
  template: `
    <div
      class="card"
      [routerLink]="['/es', 'share', user.userHarvestId]"
      *transloco="let t"
    >
      <div class="cell">
        <div class="title">
          <small>{{ t('exchange.name') }}</small>
          <h3>{{ user.nickname }}</h3>
        </div>
        <app-button (click)="$event.stopPropagation(); copyToClipboard()"
          ><span class="material-symbols-outlined"> content_copy </span></app-button
        >
      </div>
      <div class="cell">
        <div class="title">
          <small>Discord ID</small>
          <h3>{{ user.discord || '' }}</h3>
        </div>
      </div>

      <div class="harvest-info">
        <div class="cell amount purple">
          <div class="title">
            <small>Monsters</small>
          </div>
          <h3>{{ user.harvest[0].length }}</h3>
        </div>

        <div class="cell amount blue">
          <div class="title">
            <small>Bosses</small>
          </div>
          <h3>{{ user.harvest[1].length }}</h3>
        </div>

        <div class="cell amount yellow">
          <div class="title">
            <small>Archis</small>
          </div>
          <h3>{{ user.harvest[2].length }}</h3>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'colors' as c;

      $primary: map-get(
        $map: c.$dark,
        $key: 300,
      );

      .card {
        box-shadow: 0 0 0 1px $primary;
        border-radius: 0.4rem;
        padding: 1rem 1rem 0;
        margin: 0 0 1rem;
        cursor: pointer;
        transition: box-shadow 0.2s ease-in-out;

        &:hover {
          box-shadow: 0 0 0 2px $primary;
        }
      }

      .harvest-info {
        display: flex;
        gap: 1rem;
        padding: 1rem 0;
      }

      .amount {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        border-radius: 0.4rem;
        width: 10rem;

        h3 {
          font-size: 2rem;
        }
      }

      .purple {
        background-color: rgba(map-get(c.$primary, 800), 0.4);
      }

      .blue {
        background-color: rgba(c.$medium-blue, 0.4);
      }

      .yellow {
        background-color: rgba(map-get(c.$primary, 600), 0.4);
      }

      .cell {
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      app-button {
        justify-self: end;
      }
    `,
  ],
})
export class UserExchangeCardComponent {
  @Input({ required: true }) user!: ExchangeResponse;

  private readonly toast = inject(HotToastService);

  copyToClipboard(): void {
    from(navigator.clipboard.writeText(`/w ${this.user.nickname} `))
      .pipe(
        this.toast.observe({
          loading: 'Copiando url en el portapapeles',
          success: 'Comando copiado en el portapapeles',
          error: 'Algo ha ido mal, intentalo más tarde',
        }),
      )
      .subscribe();
  }
}
