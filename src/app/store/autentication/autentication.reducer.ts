import { Action, createReducer, on } from '@ngrx/store';
import * as loginAction from './autentication.action';

export const initialState: State = {
  userData: undefined,
  isUserLoggedIn: undefined,
  allUsers: [],
};

export interface userData {
  emailId: string | undefined;
  userName: string | undefined;
  id: string | undefined;
}

export interface State {
  userData: userData | undefined;
  isUserLoggedIn: boolean | undefined;
  allUsers:any|[];
}

export function reducer(state: State | undefined, action: Action): any {
  return autenticationReducer(state, action);
}

export const state = (state: State) => {
  return state;
};

export const autenticationReducer = createReducer(
  initialState,
  on(loginAction.loginSuccess, (state, payload) => ({
    ...state,
    userData: payload,
    isUserLoggedIn: true,
  })),
  on(loginAction.validateSessionSucess, (state, payload) => ({
    ...state,
    userData: payload,
    isUserLoggedIn: true,
  })),
  on(loginAction.loadUserSuccess, (state, payload) => ({
    ...state,
    allUsers: payload
  })),
  on(loginAction.doLogout, (state) => ({
    ...state,
    userData:undefined,
    isUserLoggedIn: false,
  })),
  on(loginAction.registrationSucess, (state,payload) => ({
    ...state,
    allUsers: payload
  }))
);
