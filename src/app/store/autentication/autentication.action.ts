import { createAction, props } from '@ngrx/store';
import * as authenticationModel from './autentication.model';
import { userData } from './autentication.reducer';

export const doLogoin = createAction('[Autentication] DoLogin',  props<authenticationModel.LoginPayload>());
export const loginSuccess = createAction('[Autentication] loginSuccess',  props<userData>());
export const loginFail = createAction('[Autentication] loginFail',  props<{error:string}>());
export const doLogout = createAction('[Autentication] doLogout');
