import { ActionReducerMap, createFeatureSelector, createSelector,} from '@ngrx/store';
import  * as quizReducer from './quiz.reducer';

export interface quizState {
    quiz : quizReducer.State,
}


export const reducers: ActionReducerMap<any> = {
    quiz: quizReducer.reducer,
};

export const getStateSelector = createSelector(
    createFeatureSelector('Quiz'),
    quizReducer.state
);

export const getallQuix = createSelector(
    createFeatureSelector('Autentication'),
    quizReducer.state
);
