import { CommonModule, NgForOf } from '@angular/common';
import {
  Component,
  EventEmitter,
  InjectionToken,
  Output,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Observable } from 'rxjs';

import { MatMenuModule } from '@angular/material/menu';
import { TranslocoService } from '@ngneat/transloco';

import { environment } from '@environments/environment';
import { LocalStorageService } from '@shared/services/local-storage.service';
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
  imports: [NgForOf, CommonModule, RouterLink, MatMenuModule, ButtonComponent],
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
  protected readonly translate = inject(TranslocoService);
  protected readonly languages = this.translate.getAvailableLangs() as string[];
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly localStorage = inject(LocalStorageService);
  private readonly store = inject(GlobalStore);

  selectedLanguage = signal<string>(this.translate.getActiveLang());

  onLangChange(lang: string): void {
    this.localStorage.set(environment.favLangKey, lang);
    this.selectedLanguage.set(lang);
    this.router.navigate([lang, ...this.route.snapshot.url.map((u) => u.path)]);
  }

  onProfileClick(): void {
    this.router.navigate([this.translate.getActiveLang(), 'profile']);
  }

  onLogout(): void {
    this.logout.emit();
    this.store.logout();
  }
}
