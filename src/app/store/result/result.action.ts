import { createAction, props } from '@ngrx/store';
import { Result } from '@app/store/result/result.model';

export const getAllResults = createAction('[Result] GET ALL RESULT');
export const getAllResultsSuccess = createAction(
  '[Result] GET ALL RESULT SUCCESS',
  props<{ result: Result[] }>()
);

//handle error message
export const handlErrors = createAction(
  '[Result] HANDLE ERROR',
  props<{ error: any }>()
);
