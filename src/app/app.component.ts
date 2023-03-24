import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';

import { increment, decrement, reset } from 'src/app/store/counter/counter.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'technical-assistant';
  message$: Observable<any> | undefined;
  destroyer$:ReplaySubject<boolean> = new ReplaySubject;
  constructor(
    private store : Store
  ) {}

  ngOnInit() {
    this.message$ = this.store.select((state:any) => {return state.count});
    this.message$.pipe(takeUntil(this.destroyer$)).subscribe(state => {console.log(state)});
    this.store.dispatch(increment({counter:2}));
  }
  
  
  public ddestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }

   
  private public(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}