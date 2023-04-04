import { Injectable } from '@angular/core';
import {
  Observable,
  distinctUntilChanged,
  of,
  takeUntil,
  throwError,
} from 'rxjs';
import { State, Store } from '@ngrx/store';

import QuizData from '@assets/json/data.json';
import { ToastService } from '@app/component/toast/toast.service';
import { quizState } from './quiz.state';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  allQuiz: any;
  constructor(
    private store: Store,
    private toastService: ToastService,
    private state: State<quizState>
  ) {}

  getAllQuiz(): Observable<any> {
    return of(QuizData.quiz);
  }

  getSelectedQuiz(id: any): Observable<any> {
    let allQuiz = this.state.getValue().quiz.allQuiz;
    let findQuiz = allQuiz?.find((data: any) => data?.quizId == id);
    return findQuiz
      ? of(findQuiz)
      : throwError(() => new Error('No Quiz Found'));
  }

  showError(message: string) {
    this.toastService.showErrorMessage(message);
  }
}
