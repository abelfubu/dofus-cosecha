import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TOAST_CONFIG } from '@chore/config/toast.config';
import { jwtInitalizer } from '@chore/initializers/jwt.initializer';
import { appRoutes } from '@chore/routes/app.routes';
import { WINDOW } from '@chore/tokens/window.token';
import { environment } from '@environments/environment';
import { HotToastModule } from '@ngneat/hot-toast';
import { GoogleAuthDirective } from '@shared/google-auth.directive';
import { authInterceptor } from '@shared/interceptors/auth.interceptor';
import { FooterComponent } from '@shared/ui/footer/footer.component';
import { provideLanguages } from 'providers/language-provider';

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
    provideLanguages({ supportedLanguages: ['en', 'es'] }),
    importProvidersFrom([
      HotToastModule.forRoot(TOAST_CONFIG),
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        registrationStrategy: 'registerWhenStable:30000',
      }),
    ]),
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
