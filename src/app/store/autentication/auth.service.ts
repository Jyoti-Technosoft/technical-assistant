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

  getUser(payload: any): Observable<any> {
    if (!this.users) {
      this.getUsers();
    }
    let findUser = this.users?.find(
      (user: any) =>
        this.decodeObj(user.password) == payload.password &&
        user.email == payload.emailId
    );
    if (findUser) {
      let loggedUser = {
        fullName: findUser?.fullName,
        email: findUser?.email,
        dateOfBirth: findUser?.dateOfBirth,
        mobile: findUser?.mobile,
        gender: findUser?.gender,
      };
      return of(loggedUser);
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
      users = [...users, userValue]
      localStorage.setItem('registerUser', JSON.stringify(users));
      return of(users);
    }
  }

  routeToDashboard(data: any): void {
    localStorage.setItem('isAuthenticate', 'true');
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

  routeToLogin() {
    this.router.navigateByUrl('login');
    this.toastService.showSuccessMessage('User Registered');
  }

  logout() {
    localStorage.setItem('isAuthenticate', 'false');
    this.toastService.showSuccessMessage('Logout Successfully');
    this.cookieService.delete('info_token');
    this.router.navigateByUrl('login');
  }
}
