import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { State } from '@ngrx/store';

import { autenticationState } from '@app/store/autentication/autentication.state';

@Injectable({
  providedIn: 'root',
})
export class NonAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: State<autenticationState>
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      
    if (this.store.getValue().authentication.isUserLoggedIn) {
      this.router.navigateByUrl('dashboard');
      return true;
    }
    return true;
  }
}
