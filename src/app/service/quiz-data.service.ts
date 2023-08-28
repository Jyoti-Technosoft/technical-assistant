import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizDataService {

  url = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  getQuizDetails(): Observable<any> {
    return this.http.get(`${this.url}/quizDetails`);
  }

  getSingleQuizDetails(name: string): Observable<any> {
    return this.http.get(`${this.url}/quizDetails/${name}`);
  }

  getListOfQuizDetails(id: string): Observable<any> {
    return this.http.get(`${this.url}/questionsList/${id}`);
  }
}
