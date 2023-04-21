import { Action, createReducer, on } from '@ngrx/store';
import * as resultAction from '@app/store/result/result.action';
import { Result } from '@app/store/result/result.model';

export const initialState: State = {
    results: undefined
};

export interface State {
    results: Result[] | undefined;
}

export function reducer(state: State | undefined, action: Action): any {
  return resultReducer(state, action);
}

export const state = (state: State) => {
  return state;
};

export const resultReducer = createReducer(
  initialState,
  on(resultAction.getAllResultsSuccess, (state, { result }) => ({
    ...state, results:result
  })),
  on(resultAction.addResultsSuccess, (state, { result }) => ({
    ...state, results: state?.results ?  [result,...state?.results] : [result]
  }))
);
