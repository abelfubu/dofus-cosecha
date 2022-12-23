import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';
import { HotToastModule } from '@ngneat/hot-toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TOAST_CONFIG } from './chore/config/toast.config';
import { JWT_INITIALIZER } from './chore/initializers/jwt.initializer';
import { GoogleAuthDirective } from './shared/google-auth.directive';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { FooterComponent } from './shared/ui/footer/footer.component';
import { WINDOW } from './chore/tokens/window.token';

@NgModule({
  declarations: [AppComponent, GoogleAuthDirective],
  imports: [
    BrowserModule,
    FooterComponent,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HotToastModule.forRoot(TOAST_CONFIG),
  ],
  providers: [
    JWT_INITIALIZER,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: WINDOW,
      useFactory: () => (typeof window !== 'undefined' ? window : null),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
