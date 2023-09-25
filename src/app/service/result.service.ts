import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  serverUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  addResultData(data: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/result`, data);
  }

  getUserResultData(userId: number): Observable<any> {
    return this.http.get(`${this.serverUrl}/result/${userId}`);
  }
}
