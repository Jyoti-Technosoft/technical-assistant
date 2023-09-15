import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class QuizDataService {

  url = 'http://localhost:3000';
  serverUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  getQuizName(): Observable<any> {
    return this.http.get(`${this.serverUrl}/quiz`);
  }

  getSingleQuizDetails(name: string): Observable<any> {
    return this.http.get(`${this.url}/quizDetails/${name}`);
  }

  getListOfQuizDetails(id: string): Observable<any> {
    return this.http.get(`${this.url}/questionsList/${id}`);
  }
}
