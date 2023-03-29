import { Injectable } from '@angular/core';
import { find, Observable, throwError } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  getUser(payload: any): Observable<any> {
    let users = JSON.parse(localStorage.getItem('registerUser') as string);
    let findUser = users?.find((user: any) => user.password == payload.password && user.email == payload.emailId);
    if (findUser) {
      return of(findUser);
    }
    return throwError(() => new Error('No User Found With This Login credentical'));
  }
}
