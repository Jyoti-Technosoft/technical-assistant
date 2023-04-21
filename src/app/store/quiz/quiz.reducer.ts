import { Action, createReducer, on } from '@ngrx/store';
import * as quizAction from './quiz.action';
import { quiz,quizResult } from './quiz.model';

export const initialState: State = {
  allQuiz: undefined,
  selectedQuiz: undefined,
  latestQuizResult : undefined
};

export interface State {
  allQuiz: quiz[] | undefined;
  selectedQuiz: quiz | undefined;
  latestQuizResult: quizResult | undefined;
}

export function reducer(state: State | undefined, action: Action): any {
  return quizReducer(state, action);
}

export const state = (state: State) => {
  return state;
};

export const quizReducer = createReducer(
  initialState,
  on(quizAction.AllQuizSucess, (state, payload) => ({
    ...state,     
    allQuiz: payload.quizes,
  })),
  on(quizAction.selectQuizSucess, (state, payload) => ({
    ...state,
    selectedQuiz: payload.quiz,
  })),
  on(quizAction.successQuizPlay, (state, payload) => ({
    ...state,
    latestQuizResult: payload.result,
  })),
  on(quizAction.deleteQuizSucess, (state, payload) => ({
    ...state,
    allQuiz : state?.allQuiz?.filter((item:any)=>item.id != payload?.id),
  })),
  on(quizAction.addQuizSucess, (state, payload) => ({
    ...state,
    allQuiz : state?.allQuiz?.concat(payload.quiz),
  })),
  on(quizAction.addQuestionSuccess, (state, payload) => ({
    ...state,
    allQuiz : state?.allQuiz?.concat(payload.question),
  })),
  on(quizAction.emptyQuizPlay, (state, payload) => ({
    ...state,
    latestQuizResult: undefined,
  }))
);
