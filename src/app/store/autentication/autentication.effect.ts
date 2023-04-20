import { OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { distinctUntilChanged, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as autenticationAction from '@app/store/autentication/autentication.action';
import { AuthService } from '@app/store/autentication/auth.service';

@Injectable()
export class AuthEffects implements OnDestroy {
  constructor(private actions$: Actions, private authSerivce: AuthService) {}

  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  getAllUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.getAllUsers),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
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
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      switchMap((payload) => {
        return this.authSerivce.getUser(payload).pipe(
          map((userData: any) => autenticationAction.loginSuccess({userData})),
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


  updateUserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.updateUserDetails),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      switchMap((payload) => {
        return this.authSerivce.updateUserDetails(payload).pipe(
          map((users: any) => autenticationAction.updateUserDetailsSucess({users})),
          catchError((error: any) =>
            of(autenticationAction.handlErrors({ error }))
          )
        );
      })
    )
  );

  validateSesion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.validateSession),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      switchMap((payload) => {
        return this.authSerivce
          .validateSession()
          .pipe(
            map((response) =>
              autenticationAction.validateSessionSucess({userData:response})
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
      tap(() => {
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
