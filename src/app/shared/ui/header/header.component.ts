import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, InjectionToken, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalStore } from '../../store/global.store';
import { ButtonComponent } from '../button/button.component';

interface GlobalUser {
  isLoggedIn: boolean;
  email: string;
  picture: string;
}

const GLOBAL_USER = new InjectionToken<Observable<GlobalUser>>('GLOBAL_USER');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterModule],
  providers: [
    {
      provide: GLOBAL_USER,
      useFactory: (global: GlobalStore) => global.user$,
      deps: [GlobalStore],
    },
  ],
})
export class HeaderComponent {
  @Output() logout = new EventEmitter();

  protected readonly user$ = inject(GLOBAL_USER);
}
