import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class QuizDataService {

  url = 'http://localhost:3000';
  queData = [
    {
      sub: 'angular', dataFile: 'assets/json/angularjs.json'
    },
    {
      sub: 'htmlCss', dataFile: 'assets/json/html_css.json'
    },
    {
      sub: 'javascript', dataFile: 'assets/json/javascript.json'
    },
    {
      sub: 'reactJS', dataFile: 'assets/json/reactjs.json'
    }
  ];
  serverUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  getQuizName(): Observable<any> {
    return this.http.get(`${this.serverUrl}/quiz`);
  }

  getListOfQuizDetails(filePath: string): Observable<any> {
    return this.http.get(filePath);
  }
}
