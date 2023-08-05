import { Injectable } from '@angular/core';
import {
  Observable,
  of,
  throwError,
} from 'rxjs';
import { State, Store } from '@ngrx/store';
import { ToastService } from '@app/toast.service';
import { quizState } from './quiz.state';
import { TOAST_BG_COLOR } from '@app/shared/toast.enum';
import angularQuiz  from '@assets/json/angularjs.json';
import htmlCssQuiz  from '@assets/json/html_css.json';
import javaScriptQuiz  from '@assets/json/javascript.json';
import reactQuiz  from '@assets/json/reactjs.json';


@Injectable({
  providedIn: 'root',
})

export class QuizService {
  allQuiz: any;

  allAngular = { ...angularQuiz.angularjs };
  allHtmlCss = { ...htmlCssQuiz.html_css };
  allJavaScript = { ...javaScriptQuiz.javascript };
  allReact = { ...reactQuiz.react_js };
  // use import json file here
  myAllQuiz = [ this.allAngular, this.allHtmlCss, this.allJavaScript, this.allReact ];

  constructor(
    private store: Store,
    private toastService: ToastService,
    private state: State<quizState>
  ) { }

  getAllQuiz(): Observable<any> {
    return of(this.myAllQuiz)
  }

  getSelectedQuiz(id: any): Observable<any> {
    let allQuiz = this.state.getValue().quiz.allQuiz;
    let findQuiz = allQuiz?.find((data: any) => data?.quizId == id);
    return findQuiz
      ? of(findQuiz)
      : throwError(() => new Error('No Quiz Found'));
  }

  showError(message: string) {
    this.toastService.toastMessage(
      { label: message, icon: 'error' },
      TOAST_BG_COLOR.TOAST_ERROR_COLOR
    );
  }
}
