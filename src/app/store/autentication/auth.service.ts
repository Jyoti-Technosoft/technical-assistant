import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

import { ToastService } from '@app/toast.service';

import {
  LOGIN_WRONG_CREDENTIAL,
  LOGOUT_SUCCESSFULLY,
  REGISTERED_SUCCESSFULLY,
  LOGIN_SUCCESSFULLY,
  ALREADY_REGISTERED_EMAIL,
  TOKEN,
  TOAST_BG_COLOR,
} from '@app/shared/toast.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: any;
  usersUrl = 'http://localhost:3000/user';
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private router: Router,
    private toastService: ToastService,
    private cookieService: CookieService,
    private state: Store<any>,
    private http: HttpClient
  ) {}

  validateSession(): Observable<any> {
    if(this.decodeObj(this.getUserId()).id) {
      return of(this.decodeObj(this.getUserId()))
    }
    return throwError(() => new Error(TOKEN));
  }

  getUser(payload: any): Observable<any> {
    const value = this.http.get(this.usersUrl+`?email=${payload.email}&password=${this.encodeObj(payload.password)}`);
    return value
  }

  registerUser(userValue: any): Observable<any> {
    return this.http.post(`${this.usersUrl}`, userValue);
  }

  routeToDashboard(data: any): void {
    this.cookieService.set('info_token', this.encodeObj(data.userData), 1);
    this.router.navigateByUrl('dashboard');
    this.toastService.toastMessage(
      LOGIN_SUCCESSFULLY,
      TOAST_BG_COLOR.TOAST_SUCCESS_COLOR
    );
  }

  encodeObj(obj: any) {
    return window.btoa(JSON.stringify(obj));
  }

  decodeObj(obj: any) {
    return JSON.parse(window.atob(obj));
  }

  loginFail(message: string) {
    this.toastService.toastMessage(
      { label: message, icon: 'fa-solid fa-xmark' },
      TOAST_BG_COLOR.TOAST_ERROR_COLOR
    );
  }

  getUserId() {
    let cookie = this.cookieService.get('info_token');
    return cookie ?? this.decodeObj(cookie);
  }

  getStateData(user?: any): Observable<any> {
    let loggedUser = {
      fullName: user?.fullName,
      email: user?.email,
      dateOfBirth: user?.dateOfBirth,
      mobile: user?.mobile,
      gender: user?.gender,
      id: user?.id,
    };
    return of(loggedUser);
  }

  routeToLogin() {
    this.router.navigateByUrl('login');
    this.toastService.toastMessage(
      REGISTERED_SUCCESSFULLY,
      TOAST_BG_COLOR.TOAST_SUCCESS_COLOR
    );
  }

  logout() {
    this.toastService.toastMessage(
      LOGOUT_SUCCESSFULLY,
      TOAST_BG_COLOR.TOAST_SUCCESS_COLOR
    );
    this.cookieService.delete('info_token');
    this.router.navigateByUrl('login');
  }

  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
