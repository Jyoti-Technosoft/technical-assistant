import { Injectable } from '@angular/core';
import {
  Observable
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ToastService } from '@app/component/toast/toast.service';
import { CREATED_QUIZ_SUCCESSFULLY, DELETE_SUCCESSFULLY, TOAST_BG_COLOR } from '@app/shared/toast.enum';

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

  deleteQuiz(id:number): Observable<any> {
    this.toastService.toastMessage(
      DELETE_SUCCESSFULLY,
      TOAST_BG_COLOR.TOAST_SUCCESS_COLOR
    );
    return this.http.delete(this.allQuizUrl+`/${id}`)
  }

  createQuiz(quizValue:any): Observable<any> {
    this.toastService.toastMessage(
      CREATED_QUIZ_SUCCESSFULLY,
      TOAST_BG_COLOR.TOAST_SUCCESS_COLOR
    );
    return this.http.post(this.allQuizUrl,quizValue)
  }

  createQuestion(question:any){
    debugger
    return this.http.post(this.allQuizUrl,question)
  }
}
