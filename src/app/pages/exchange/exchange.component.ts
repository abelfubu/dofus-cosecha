import { NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@ngneat/transloco';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { UserExchangeCardComponent } from './components/user-exchange-card.component';
import { ExchangeStore } from './exchange.store';

@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [HeaderComponent, UserExchangeCardComponent, NgForOf, TranslocoModule],
  providers: [ExchangeStore],
  template: `
    <ng-container *transloco="let t">
      <app-header />

      <h1>{{ t('exchange.title', { server: vm()?.at(0)?.server }) }}</h1>
    </ng-container>
    <app-user-exchange-card *ngFor="let user of vm()" [user]="user" />
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      h1 {
        padding: 0 0 2rem;
      }
    `,
  ],
})
export class ExchangeComponent {
  private readonly store = inject(ExchangeStore);
  protected readonly vm = toSignal(this.store.vm$);

  ngOnInit(): void {
    this.store.getUsers();
  }
}
