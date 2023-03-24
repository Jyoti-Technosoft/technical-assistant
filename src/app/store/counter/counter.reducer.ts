import { Action, createReducer, on } from '@ngrx/store';
import * as counteAction from './counter.action';


export const initialState:State = {counter:0};

export interface State {
  counter: number;
}


export function reducer(state: State | undefined, action: Action): any {
  return counterReducer(state, action);
}


export const state = (state:State) => {return state}

export const counterReducer = createReducer(
  initialState,
  on(counteAction.increment, (state) => ({
    ...state, counter: state.counter +1
  })),

);
