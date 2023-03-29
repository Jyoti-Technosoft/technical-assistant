import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
 
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './counter/counter.reducer';
import { autenticationReducer } from './autentication/autentication.reducer';
import { AuthEffects } from './autentication/autentication.effect';
 
const State = {
    count : counterReducer,
    authentication : autenticationReducer
}

@NgModule({
  declarations: [],
  imports: [StoreModule.forRoot(State),
    EffectsModule.forRoot([AuthEffects])
],
  providers: [],
  bootstrap: [],
})
export class storeModule {}