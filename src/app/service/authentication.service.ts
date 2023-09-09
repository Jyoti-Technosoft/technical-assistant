import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  url = 'http://localhost:3000';

  authStatusListener$: BehaviorSubject<boolean>;
  mobileView$: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private responsive: BreakpointObserver
  ) {

    this.authStatusListener$ = new BehaviorSubject<boolean>(false);
    this.mobileView$ = new BehaviorSubject<boolean>(false);

    this.getScreenSize();
  }

  getScreenSize() {
    this.responsive.observe([Breakpoints.XSmall,Breakpoints.Small])
      .subscribe(result => {
        const breakpoints = result.breakpoints;
        if (breakpoints[Breakpoints.XSmall] || breakpoints[Breakpoints.Small]) {
          this.mobileView$.next(true);
        } else {
          this.mobileView$.next(false);
        }
      });
    return this.mobileView$.asObservable();
  }

  getAllUser(): Observable<any> {
    return this.http.get(`${this.url}/userData`);
  }

  addUserData(data: any): Observable<any> {
    return this.http.post(`${this.url}/userData`, data);
  }

  updateUserData(data: any, id: number): Observable<any> {
    return this.http.patch(`${this.url}/userData/${id}`, data);
  }

  getSingleUserData(id: number): Observable<any> {
    return this.http.get(`${this.url}/userData/${id}`);
  }

  updatePassword(data: any, id: number): Observable<any> {
    return this.http.patch(`${this.url}/userData/${id}`, data);
  }

  getAuthStatusListener() {
    return this.authStatusListener$.asObservable();
  }
}
