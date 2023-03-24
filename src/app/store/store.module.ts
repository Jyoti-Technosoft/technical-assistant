import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
 
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './counter/counter.reducer';
 
const State = {
    count : counterReducer
}

@NgModule({
  declarations: [],
  imports: [StoreModule.forRoot(State),
],
  providers: [],
  bootstrap: [],
})
export class storeModule {}