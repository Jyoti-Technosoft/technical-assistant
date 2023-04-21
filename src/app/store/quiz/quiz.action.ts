import { createAction, props } from '@ngrx/store';
import { quiz } from './quiz.model';

export const getAllQuiz = createAction('[Quiz] getAllQuiz');
export const AllQuizSucess = createAction('[Quiz] getAllSucess', props<{quizes:quiz[]}>());


export const selectQuiz = createAction('[Quiz] selectQuiz', props<{quizId:string}>());
export const selectQuizSucess = createAction('[Quiz] selectQuizSucess', props<{quiz:quiz}>());
export const selectQuizError = createAction('[Quiz] selectQuizError', props<{error:string}>());

export const successQuizPlay = createAction('[Quiz] successQuizPlay', props<{result:any}>());
export const emptyQuizPlay = createAction('[Quiz] emptyQuizPlay');

export const deleteQuiz = createAction('[Quiz] DELETEQUIZ', props<{id:number}>());
export const deleteQuizSucess = createAction('[Quiz] DELETEQUIZSUCESS',props<{id:number}>());

export const addQuiz = createAction('[Quiz] addQuiz', props<{quiz:any}>());
export const addQuizSucess = createAction('[Quiz] addQuizSucess',props<{quiz:any}>());

export const addQuestion = createAction('[Quiz] addQuestion', props<{question:any}>());
export const addQuestionSuccess = createAction('[Quiz] addQuestionSuccess', props<{question:any}>());