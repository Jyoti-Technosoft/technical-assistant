import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LOCALSTORAGE_KEY } from '@app/utility/utility';
import { AuthenticationService } from '@app/service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {

  userToken!: string;
  userRole!: string;

  constructor(
    private router: Router,
    private auth: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    this.userToken = this.auth.getAuthToken();
    this.userRole = JSON.parse(JSON.stringify(localStorage.getItem('role')));

    if (this.userToken) {
      if (this.userRole === 'admin') {
        this.router.createUrlTree(['/admin-layout']);
        return true;
      } else {
        this.router.createUrlTree(['/layout']);
        return true;
      }
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }

}
