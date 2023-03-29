import { Injectable, Pipe } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as autenticationAction from './autentication.action';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authSerivce: AuthService) {}

  doLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autenticationAction.doLogoin),
      switchMap((payload) => {
        return this.authSerivce.getUser(payload).pipe(
          map((response: any) => {
            alert("login Successully")
            return autenticationAction.loginSuccess(response);
          }),
          catchError((error: any) =>
            of(autenticationAction.loginFail(error.message))
          )
        );
      })
    )
  );

  loginFail$ = createEffect(() =>
  this.actions$.pipe(
    ofType(autenticationAction.loginFail),
    switchMap((payload) => {
      return this.authSerivce.getUser(payload).pipe(
        map((response: any) => {
          alert("login Unsuccefull , Login credentials do not match our records.")
          return autenticationAction.loginFail(response);
        }),
        catchError((error: any) =>
          of(autenticationAction.loginFail(error.message))
        )
      );
    })
  )
);

}
