import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleAuthDirective } from './shared/google-auth.directive';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { HeaderComponent } from './shared/ui/header/header.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { JWT_INITIALIZER } from './chore/initializers/jwt.initializer';
import { TOAST_CONFIG } from './chore/config/toast.config';

@NgModule({
  declarations: [AppComponent, GoogleAuthDirective],
  imports: [
    BrowserModule,
    HeaderComponent,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
