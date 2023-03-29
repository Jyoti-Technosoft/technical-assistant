import { OnDestroy } from '@angular/core';
import { Injectable, Pipe } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { distinctUntilChanged, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as autenticationAction from './autentication.action';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects implements OnDestroy {
  constructor(private actions$: Actions, private authSerivce: AuthService) {}

  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  getAllUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.getAllUsers),
      switchMap((payload) => {
        return this.authSerivce
          .getAllUsers()
          .pipe(map((users) => autenticationAction.loadUserSuccess({ users })));
      })
    )
  );

  doLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.doLogoin),
      switchMap((payload) => {
        return this.authSerivce.getUser(payload).pipe(
          map((response: any) => autenticationAction.loginSuccess(response)),
          catchError((error: any) =>
            of(autenticationAction.handlErrors({ error }))
          )
        );
      })
    )
  );

  doRegister$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.doRegistration),
      distinctUntilChanged(),
      switchMap((payload) => {
        return this.authSerivce.registerUser(payload).pipe(
          map((users: any) =>
            autenticationAction.registrationSucess({ users })
          ),
          catchError((error: any) =>
            of(autenticationAction.handlErrors({ error }))
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

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.registrationSucess),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      tap((data) => {
        this.authSerivce.routeToLogin();
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

  handleErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.handlErrors),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      tap((data) => {
        this.authSerivce.loginFail(data.error);
      })
    )
  );

  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
