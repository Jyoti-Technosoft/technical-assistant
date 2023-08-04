import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import {
  getAllUsers,
  validateSession,
} from './store/autentication/autentication.action';
import { QuizDataService } from './quiz-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'technical-assistant';
  message$: Observable<any> | undefined;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();



  htmlCssData: any;
  angularJsData: any;
  javaScriptData: any;
  reactJsData: any;

  constructor(private store: Store, private quizDataService: QuizDataService) {  }

  ngOnInit() {
    this.store.dispatch(getAllUsers());
    this.store.dispatch(validateSession());
  }

}
