import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { TOAST_CONFIG } from '@chore/config/toast.config';
import { jwtInitalizer } from '@chore/initializers/jwt.initializer';
import { appRoutes } from '@chore/routes/app.routes';
import { WINDOW } from '@chore/tokens/window.token';
import { HotToastModule } from '@ngneat/hot-toast';
import { GoogleAuthDirective } from '@shared/google-auth.directive';
import { authInterceptor } from '@shared/interceptors/auth.interceptor';
import { FooterComponent } from '@shared/ui/footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-google-auth></app-google-auth>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  imports: [GoogleAuthDirective, RouterOutlet, FooterComponent],
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom([HotToastModule.forRoot(TOAST_CONFIG)]),
    {
      provide: APP_INITIALIZER,
      useFactory: jwtInitalizer,
      multi: true,
    },
    {
      provide: WINDOW,
      useFactory: () => (typeof window !== 'undefined' ? window : null),
    },
  ],
});
