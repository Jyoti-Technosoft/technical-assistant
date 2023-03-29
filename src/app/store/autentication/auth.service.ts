import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { ToastService } from '@app/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private toastService: ToastService,
    private cookieService: CookieService
  ) {}

  getUser(payload: any): Observable<any> {
    let users = JSON.parse(localStorage.getItem('registerUser') as string);
    let findUser = users?.find(
      (user: any) =>
        user.password == payload.password && user.email == payload.emailId
    );
    if (findUser) {
      return of(findUser);
    }
    return throwError(
      () => new Error('No User Found With This Login credentical')
    );
  }

  routeToDashboard(data:any): void {
    localStorage.setItem('isAuthenticate', 'true');
    this.cookieService.set('userName',data.id,1)
    this.router.navigateByUrl('dashboard');
    this.toastService.showSuccessMessage('Login Successfully');
  }

  loginFail() {
    this.toastService.showErrorMessage('Wrong Credentials');
  }

  logout() {
    localStorage.setItem('isAuthenticate', 'false');
    this.toastService.showSuccessMessage('Logout Successfully');
    this.cookieService.delete('userName');
    this.router.navigateByUrl('login');
  }
}
