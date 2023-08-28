import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import {
  Observable,
} from 'rxjs';
import { LOCALSTORAGE_KEY } from '@app/utility/utility';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {

  userData!: boolean;
  userToken!: boolean;

  constructor(
    private router: Router
  ) {
    this.userToken = JSON.parse(JSON.stringify(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN)));
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree {

    let checkData = Boolean(this.userToken) ? true : this.router.createUrlTree(['/login']);
    return checkData;
  }

}
