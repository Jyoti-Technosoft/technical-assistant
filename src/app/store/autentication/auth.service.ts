import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { OnInit } from '@angular/core';

import { ToastService } from '@app/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  users: any;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private router: Router,
    private toastService: ToastService,
    private cookieService: CookieService,
    private state: Store<any>
  ) {}

  ngOnInit(): void {}

  private getUsers() {
    this.state
      .select((state) => state.authentication)
      .subscribe((data: any) => {
        this.users = data?.allUsers?.users;
      });
  }

  validateSession(): Observable<any> {
    if (!this.users) {
      this.getUsers();
    }
    if (this.getUserId()) {
      let findUser = this.users?.find((user: any) => 
        this.decodeObj(this.getUserId()) == user.id
      );
      if(findUser) {
        return this.getStateData(findUser);
      }
    }
    return throwError(
      () => new Error('No Token Found')
    );
  }

  getUser(payload: any): Observable<any> {
    if (!this.users) {
      this.getUsers();
    }
    let findUser = this.users?.find((user: any) =>
      this.decodeObj(user.password) == payload.password &&
        user.email == payload.emailId
    );
    if (findUser) {
      return this.getStateData(findUser);
    }
    return throwError(
      () => new Error('No User Found With This Login credentical')
    );
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
      return throwError(
        () => new Error('User with this email already registered')
      );
    } else {
      let users = this.users;
      users = [...users, userValue];
      localStorage.setItem('registerUser', JSON.stringify(users));
      return of(users);
    }
  }

  routeToDashboard(data: any): void {
    this.cookieService.set('info_token', this.encodeObj(data.id), 1);
    this.router.navigateByUrl('dashboard');
    this.toastService.showSuccessMessage('Login Successfully');
  }

  encodeObj(obj: any) {
    return window.btoa(JSON.stringify(obj));
  }

  decodeObj(obj: any) {
    return JSON.parse(window.atob(obj));
  }

  loginFail(message: string) {
    this.toastService.showErrorMessage(message);
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
    this.toastService.showSuccessMessage('User Registered');
  }

  logout() {
    this.toastService.showSuccessMessage('Logout Successfully');
    this.cookieService.delete('info_token');
    this.router.navigateByUrl('login');
  }
}
