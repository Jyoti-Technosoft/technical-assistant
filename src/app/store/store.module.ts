import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { StoreModule } from '@ngrx/store';
import { autenticationReducer } from '@app/store/autentication/autentication.reducer';

import { AuthEffects } from '@app/store/autentication/autentication.effect';
import { quizEffects } from '@app/store/quiz/quiz.effect';
import { quizReducer } from '@app/store/quiz/quiz.reducer';
import { ResultEffects } from '@app/store/result/result.effect';
import { resultReducer } from '@app/store/result/result.reducer';

const State = {
  authentication: autenticationReducer,
  quiz: quizReducer,
  result: resultReducer
};

const reducers = [
  AuthEffects,
  quizEffects,
  ResultEffects
]

@NgModule({
  declarations: [],
  imports: [StoreModule.forRoot(State), EffectsModule.forRoot(reducers)],
  providers: [],
  bootstrap: [],
})
export class storeModule {}
