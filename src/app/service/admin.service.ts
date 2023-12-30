import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  serverUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  getAllUserData(params: HttpParams): Observable<any> {
    return this.http.get(`${this.serverUrl}/users`, {params}) as Observable<any>;
  }
}
