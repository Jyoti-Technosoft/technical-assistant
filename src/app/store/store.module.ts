import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { StoreModule } from '@ngrx/store';
import { autenticationReducer } from '@app/store/autentication/autentication.reducer';

import { AuthEffects } from '@app/store/autentication/autentication.effect';
import { quizEffects } from './quiz/quiz.effect';
import { quizReducer } from './quiz/quiz.reducer';

const State = {
  authentication: autenticationReducer,
  quiz: quizReducer
};

const reducers = [
  AuthEffects,
  quizEffects
]

@NgModule({
  declarations: [],
  imports: [StoreModule.forRoot(State), EffectsModule.forRoot(reducers)],
  providers: [],
  bootstrap: [],
})
export class storeModule {}
