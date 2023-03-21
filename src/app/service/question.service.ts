import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  userName: any;
  points: number = 0;
  correctanswer: number = 0;
  inCorrectAnswer: number = 0;
  public selectedQuiztype!: string;

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {}

  getUser(): string | boolean {
    if (document.cookie) {
      let cookie = document.cookie;
      cookie = cookie.split('=')[1];
      return cookie;
    } else {
      return false;
    }
  }
}
