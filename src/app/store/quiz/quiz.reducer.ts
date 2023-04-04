import { Action, createReducer, on } from '@ngrx/store';
import * as counteAction from './quiz.action';
import { quiz } from './quiz.model';

export const initialState: State = {
  allQuiz: undefined,
  selectedQuiz: undefined,
};

export interface State {
  allQuiz: quiz[] | undefined;
  selectedQuiz: quiz | undefined;
}

export function reducer(state: State | undefined, action: Action): any {
  return quizReducer(state, action);
}

export const state = (state: State) => {
  return state;
};

export const quizReducer = createReducer(
  initialState,
  on(counteAction.AllQuizSucess, (state, payload) => ({
    ...state,
    allQuiz: payload.quizes,
  })),
  on(counteAction.selectQuizSucess, (state, payload) => ({
    ...state,
    selectedQuiz: payload.quiz,
  }))
);
