import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ExchangeResponse } from '../models/exchange.response';

@Component({
  selector: 'app-user-exchange-card',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ButtonComponent],
  template: `
    <div class="card">
      <div class="cell">
        <div class="title">
          <small>Nombre</small>
        </div>
        <img ngSrc="./assets/img/dofus.png" alt="Dofus Logo" width="24" height="24" />
        <h3>{{ user.nickname }}</h3>
      </div>

      <div class="cell">
        <div class="title">
          <small>Discord ID</small>
        </div>
        <img ngSrc="./assets/img/discord.png" alt="Discord Logo" width="24" height="24" />
        <h3>{{ user.discord }}</h3>
      </div>

      <div class="cell">
        <div class="title">
          <small>Monsters</small>
        </div>
        <h3>{{ user.harvest[0].length }}</h3>
      </div>

      <div class="cell">
        <div class="title">
          <small>Bosses</small>
        </div>
        <h3>{{ user.harvest[1].length }}</h3>
      </div>

      <div class="cell">
        <div class="title">
          <small>Archis</small>
        </div>
        <h3>{{ user.harvest[2].length }}</h3>
      </div>

      <app-button [routerLink]="['/es', 'share', user.userHarvestId]">
        <span class="material-symbols-outlined"> visibility </span>
      </app-button>
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
        padding: 1rem;
        margin: 0 0 1rem;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
      }

      .cell {
        img {
          transform: translateY(5px);
          margin-right: 0.2rem;
        }

        h3 {
          display: inline;
        }
      }

      app-button {
        justify-self: end;
      }
    `,
  ],
})
export class UserExchangeCardComponent {
  @Input({ required: true }) user!: ExchangeResponse;
}
