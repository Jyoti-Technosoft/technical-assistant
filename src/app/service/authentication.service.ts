import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { environment } from 'environments/environment.development';
import { LOCALSTORAGE_KEY } from '@app/utility/utility';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  serverUrl = environment.API_URL;
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

  // detect screen size
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

  // login
  logInUser(data: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/login`, data, {headers:{skip:"true"}});
  }

  // register
  registerUser(userdata: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/register`, userdata, {headers:{skip:"true"}});
  }

  // logout
  signOutUser(userId: number): Observable<any> {
    return this.http.get(`${this.serverUrl}/sign-out/${userId}`, {headers:{skip:"true"}});
  }

  // get user details
  getUserDetail(userId: number): Observable<any> {
    return this.http.get(`${this.serverUrl}/user/${userId}`);
  }

  // update user details
  updateUserData(data: any, userId: number): Observable<any> {
    return this.http.put(`${this.serverUrl}/edit-user/${userId}`, data);
  }

  // updadte user password
  changePassword(data: any): Observable<any> {
    return this.http.put(`${this.serverUrl}/change-password`, data);
  }

  getAuthStatusListener() {
    return this.authStatusListener$.asObservable();
  }

  getAuthToken(): string {
    return JSON.parse(JSON.stringify(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN)))
  }

  removerToken(): void {
    localStorage.removeItem(LOCALSTORAGE_KEY.TOKEN);
  }

  getUserId(): number {
    return JSON.parse(JSON.stringify(localStorage.getItem(LOCALSTORAGE_KEY.USERID)));
  }
}
