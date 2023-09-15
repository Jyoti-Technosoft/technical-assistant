import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  serverUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  getAllCountData(userId: number): Observable<any> {
    return this.http.get(`${this.serverUrl}/countData/${userId}`);
  }
}
