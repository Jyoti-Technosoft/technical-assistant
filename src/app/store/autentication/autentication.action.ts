import { createAction, props } from '@ngrx/store';
import * as authenticationModel from './autentication.model';

export const validateSession = createAction('[Autentication] ValidateSession');
export const validateSessionSucess = createAction('[Autentication] validateSessionSucess',props<{userData:authenticationModel.RegisteredPayload}>());


export const getAllUsers = createAction('[Autentication] getAllUsers');
export const loadUserSuccess = createAction('[Autentication] loadUserSuccess',props<{users:any}>());
export const updateUserDetails = createAction('[Autentication] updateUserDetails',props<{user:authenticationModel.updateDetailsPayload}>());
export const updateUserDetailsSucess = createAction('[Autentication] updateUserDetailsSucess',props<{users:authenticationModel.RegisteredPayload}>());


export const doLogoin = createAction('[Autentication] DoLogin',  props<authenticationModel.LoginPayload>());
export const loginSuccess = createAction('[Autentication] loginSuccess',  props<{userData:authenticationModel.updateDetailsPayload}>());
export const doLogout = createAction('[Autentication] doLogout');

export const doRegistration = createAction('[Autentication] doRegistration', props<authenticationModel.RegisteredPayload>());
export const registrationSucess = createAction('[Autentication] registrationSucess', props<{users:any}>());

//handle error message
export const handlErrors = createAction('[Autentication] handle errors',  props<{error:any}>());