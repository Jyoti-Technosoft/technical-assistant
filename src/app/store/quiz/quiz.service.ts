import { Injectable } from '@angular/core';
import {
  Observable
} from 'rxjs';
import { State, Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';

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
    private toastService: ToastService,
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
