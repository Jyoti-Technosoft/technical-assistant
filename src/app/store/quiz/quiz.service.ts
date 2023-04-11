import { Injectable } from '@angular/core';
import {
  Observable,
  distinctUntilChanged,
  of,
  takeUntil,
  throwError,
} from 'rxjs';
import { State, Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';

import QuizData from '@assets/json/data.json';
import { ToastService } from '@app/toast.service';
import { quizState } from './quiz.state';
import { TOAST_BG_COLOR } from '@app/shared/toast.enum';

@Injectable({
  providedIn: 'root',
})

export class QuizService {
  allQuiz: any;
  allQuizUrl = "http://localhost:3000/quiz";
  constructor(
    private store: Store,
    private toastService: ToastService,
    private state: State<quizState>,
    private http: HttpClient
  ) {}

  getAllQuiz(): Observable<any> {
    return this.http.get(this.allQuizUrl);
  }

  getSelectedQuiz(id: any): Observable<any> {
    return this.http.get(this.allQuizUrl+`/${id}`);
  }

  showError(message: string) {
    this.toastService.toastMessage(
      { label: message, icon: 'error' },
      TOAST_BG_COLOR.TOAST_ERROR_COLOR
    );
  }
}
