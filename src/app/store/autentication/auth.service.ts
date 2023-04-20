import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { OnInit } from '@angular/core';

import { ToastService } from '@app/toast.service';

import {
  LOGIN_WRONG_CREDENTIAL,
  LOGOUT_SUCCESSFULLY,
  REGISTERED_SUCCESSFULLY,
  LOGIN_SUCCESSFULLY,
  ALREADY_REGISTERED_EMAIL,
  TOKEN,
  TOAST_BG_COLOR,
  USER_DETAILS_UPDATE_SUCCESSFULLY,
} from '@app/shared/toast.enum';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  users: any;
  LoggedInUsers: any;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private router: Router,
    private toastService: ToastService,
    private cookieService: CookieService,
    private state: Store<any>
  ) {}

  private getUsers() {
    this.state
      .select((state) => state.authentication)
      .subscribe((data: any) => {
        this.users = data?.allUsers;
      });
      this.state
      .select((state) => state.authentication)
      .subscribe((data: any) => {
        this.LoggedInUsers = data?.userData;
      });
  }

  validateSession(): Observable<any> {
    if (!this.users) {
      this.getUsers();
    }
    if (this.getUserId()) {
      let findUser = this.users?.find(
        (user: any) => this.decodeObj(this.getUserId()) == user.id
      );
      if (findUser) {
        return this.getStateData(findUser);
      }
    }
    return throwError(() => new Error(TOKEN));
  }

  updateUserDetails(payload: any): Observable<any> {
    if (!this.users) {
      this.getUsers();
    }
    if (this.LoggedInUsers.id == payload?.id) {
      if (
        payload.password &&
        payload?.password != this.decodeObj(this.LoggedInUsers?.password)
      ) {
        return throwError(() => new Error('Please enter Correct Password'));
      }
      payload =  Object.assign({}, payload, {password : payload?.newPassword ? this.encodeObj(payload?.newPassword) : this.LoggedInUsers?.password})
      delete payload.newPassword;
      delete payload.confirmPassword;
      const newState = this.users?.map((user: any) => {
        if (user?.id == payload?.id) {
          user = payload;
        }
        return user;
      });

      localStorage.setItem('registerUser', JSON.stringify(newState));
      this.toastService.toastMessage(
        USER_DETAILS_UPDATE_SUCCESSFULLY,
        TOAST_BG_COLOR.TOAST_SUCCESS_COLOR
      );
      return of(payload);
    } else {
      return throwError(() => new Error(LOGIN_WRONG_CREDENTIAL));
    }
  }

  getUser(payload: any): Observable<any> {
    if (!this.users) {
      this.getUsers();
    }
    let findUser = this.users?.find(
      (user: any) =>
        this.decodeObj(user.password) == payload.password &&
        user.email == payload.email
    );
    if (findUser) {
      return this.getStateData(findUser);
    } else {
      return throwError(() => new Error(LOGIN_WRONG_CREDENTIAL));
    }
  }

  getAllUsers(): Observable<any> {
    let users = JSON.parse(localStorage.getItem('registerUser') as string);
    return users ? of(users) : of([]);
  }

  registerUser(userValue: any): Observable<any> {
    if (!this.users) {
      this.getUsers();
    }
    let findUser = this.users?.find(
      (value: any) => value.email == userValue.email
    );
    if (findUser) {
      return throwError(() => new Error(ALREADY_REGISTERED_EMAIL));
    } else {
      let users = this.users;
      users = [...users, userValue];
      localStorage.setItem('registerUser', JSON.stringify(users));
      return of(users);
    }
  }

  routeToDashboard(data: any): void {
    this.cookieService.set('info_token', this.encodeObj(data.userData.id), 1);
    this.router.navigateByUrl('dashboard');
    this.toastService.toastMessage(LOGIN_SUCCESSFULLY, TOAST_BG_COLOR.TOAST_SUCCESS_COLOR);
  }

  encodeObj(obj: any) {
    return window.btoa(JSON.stringify(obj));
  }

  decodeObj(obj: any) {
    return JSON.parse(window.atob(obj));
  }

  loginFail(message: string) {
    this.toastService.toastMessage({ label: message, icon: 'fa-solid fa-xmark' }, TOAST_BG_COLOR.TOAST_ERROR_COLOR);
  }

  getUserId() {
    let cookie = this.cookieService.get('info_token');
    return cookie ?? this.decodeObj(cookie);
  }

  getStateData(user?: any): Observable<any> {
    let loggedUser = {
      fullName: user?.fullName,
      email: user?.email,
      password: user?.password,
      dateOfBirth: user?.dateOfBirth,
      mobile: user?.mobile,
      gender: user?.gender,
      id: user?.id,
    };
    return of(loggedUser);
  }

  routeToLogin() {
    this.router.navigateByUrl('login');
    this.toastService.toastMessage(REGISTERED_SUCCESSFULLY, TOAST_BG_COLOR.TOAST_SUCCESS_COLOR);
  }

  logout() {
    this.toastService.toastMessage(LOGOUT_SUCCESSFULLY, TOAST_BG_COLOR.TOAST_SUCCESS_COLOR);
    this.cookieService.delete('info_token');
    this.router.navigateByUrl('login');
  }


  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
