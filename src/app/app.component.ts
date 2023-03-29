import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { getAllUsers } from './store/autentication/autentication.action';


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
    this.store.dispatch(getAllUsers());
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