import { OnDestroy } from '@angular/core';
import { Injectable, Pipe } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { distinctUntilChanged, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as autenticationAction from './autentication.action';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects implements OnDestroy {
  constructor(private actions$: Actions, private authSerivce: AuthService) {}

  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  doLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.doLogoin),
      switchMap((payload) => {
        return this.authSerivce.getUser(payload).pipe(
          map((response: any) => autenticationAction.loginSuccess(response)),
          catchError((error: any) =>
            of(autenticationAction.loginFail(error.message))
          )
        );
      })
    )
  );

  doLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.doLogout),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      tap((data) => {
        this.authSerivce.logout();
      })
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.loginSuccess),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      tap((data) => {
        this.authSerivce.routeToDashboard(data);
      })
    )
  );

  loginFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.loginFail),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      tap((data) => {
        this.authSerivce.loginFail();
      })
    )
  );

  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
