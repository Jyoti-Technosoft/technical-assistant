import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  getAllCountData(): Observable<any> {
    return this.http.get(`${this.url}/countData`);
  }
}
