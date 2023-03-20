import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  public selectedQuiztype!: string;

  constructor() {}
  selectedQuizType!: string;

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
