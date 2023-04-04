import { createAction, props } from '@ngrx/store';
import { quiz } from './quiz.model';

export const getAllQuiz = createAction('[Quiz] getAllQuiz');
export const AllQuizSucess = createAction('[Quiz] getAllSucess', props<{quizes:quiz[]}>());


export const selectQuiz = createAction('[Quiz] selectQuiz', props<{quizId:string | null}>());
export const selectQuizSucess = createAction('[Quiz] selectQuizSucess', props<{quiz:quiz}>());
export const selectQuizError = createAction('[Quiz] selectQuizError', props<{error:string}>());

export const successQuizPlay = createAction('[Quiz] successQuizPlay', props<{result:any}>());
export const emptyQuizPlay = createAction('[Quiz] emptyQuizPlay');