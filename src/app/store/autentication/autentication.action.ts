import { createAction, props } from '@ngrx/store';
import * as authenticationModel from './autentication.model';
import { userData } from './autentication.reducer';

export const getAllUsers = createAction('[Autentication] getAllUsers');
export const loadUserSuccess = createAction('[Autentication] loadUserSuccess',props<{users:any}>());


export const doLogoin = createAction('[Autentication] DoLogin',  props<authenticationModel.LoginPayload>());
export const loginSuccess = createAction('[Autentication] loginSuccess',  props<userData>());
export const doLogout = createAction('[Autentication] doLogout');

export const doRegistration = createAction('[Autentication] doRegistration', props<authenticationModel.RegisteredPayload>());
export const registrationSucess = createAction('[Autentication] registrationSucess', props<{users:any}>());

//handle error message
export const handlErrors = createAction('[Autentication] handle errors',  props<{error:any}>());