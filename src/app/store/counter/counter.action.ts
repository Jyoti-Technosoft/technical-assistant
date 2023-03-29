import { createAction, props } from '@ngrx/store';

export const increment = createAction('[Counter] Increment',  props<{ counter:number }>());
export const decrement = createAction('[Counter Component] Decrement');
export const reset = createAction('[Counter Component] Reset');