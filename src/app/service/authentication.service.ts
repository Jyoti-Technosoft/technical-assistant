import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {
  userName: any;
  points: number = 0;
  correctanswer: number = 0;
  inCorrectAnswer: number = 0;
  public selectedQuiztype!: string;

  constructor() {}
  
  ngOnInit(): void {}

  getUser(): string {
    return document.cookie.split('=')[1];
  }
}
