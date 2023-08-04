import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizDataService {

  constructor(private http: HttpClient) { }

  // getAngularJsQuiz() {
  //   return this.http.get<any>(`http://localhost:1000/angulatjs`);
  // }

  // getHtmlCssQuiz() {
  //   return this.http.get<any>(`http://localhost:2000/html_css`);
  // }

  // getJavaScriptQuiz() {
  //   return this.http.get<any>(`http://localhost:3000/javascript`);
  // }

  // getReactJsQuiz() {
  //   return this.http.get<any>(`http://localhost:4000/react_js`);
  // }
}
