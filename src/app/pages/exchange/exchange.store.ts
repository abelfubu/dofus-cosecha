import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs/operators';
import { ExchangeResponse } from './models/exchange.response';
import { ExchangeDataService } from './services/exchange-data.service';

export interface ExchangeState {
  users: ExchangeResponse[];
}

const DEFAULT_STATE: ExchangeState = {
  users: [],
};

@Injectable()
export class ExchangeStore extends ComponentStore<ExchangeState> {
  constructor(private readonly service: ExchangeDataService) {
    super(DEFAULT_STATE);
  }

  readonly vm$ = this.select(({ users }) => users);

  readonly getUsers = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.service.get().pipe(
          tapResponse(
            (users) => this.addUsers(users),
            (error) => console.log(error),
          ),
        ),
      ),
    ),
  );

  readonly addUsers = this.updater((state, users: ExchangeResponse[]) => ({
    ...state,
    users,
  }));
}

// SwitchMap cancels previous requests and only perform the last one
// MergeMap performs all requests in parallel
// ConcatMap Performs all requests in sequence
// ExhaustMap cancels last requests until first request is finished
