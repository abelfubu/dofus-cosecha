import { APP_INITIALIZER } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { GlobalStore } from '../../shared/store/global.store';

function getJwtUser(
  localStorageService: LocalStorageService,
  store: GlobalStore
): () => void {
  return () => {
    const accessToken = localStorageService.get<string>(environment.authKey);
    store.setLoggedIn({ accessToken });
  };
}

export const JWT_INITIALIZER = {
  provide: APP_INITIALIZER,
  useFactory: getJwtUser,
  multi: true,
  deps: [LocalStorageService, GlobalStore],
};
