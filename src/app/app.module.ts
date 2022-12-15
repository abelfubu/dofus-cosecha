import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleAuthDirective } from './shared/google-auth.directive';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { HeaderComponent } from './shared/ui/header/header.component';
import { GlobalStore } from './shared/store/global.store';
import { LocalStorageService } from './shared/services/local-storage.service';
import { environment } from 'src/environments/environment';

export function getJwtUser(
  localStorageService: LocalStorageService,
  store: GlobalStore
): () => void {
  return () => {
    const accessToken = localStorageService.get<string>(environment.authKey);
    store.setLoggedIn({ accessToken });
  };
}

@NgModule({
  declarations: [AppComponent, GoogleAuthDirective],
  imports: [
    BrowserModule,
    HeaderComponent,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: getJwtUser,
      multi: true,
      deps: [LocalStorageService, GlobalStore],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
