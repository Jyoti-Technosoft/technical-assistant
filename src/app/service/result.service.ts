import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  url = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  addResultData(data: any): Observable<any> {
    return this.http.post(`${this.url}/result`, data);
  }

  getUserResultData(userId: any): Observable<any> {
    return this.http.get(`${this.url}/result?userId=${userId}`);
  }
}
