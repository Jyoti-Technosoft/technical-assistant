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

  constructor(
    private router: Router,
    private auth: AuthenticationService
  ) {
    this.userToken = auth.getAuthToken();
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree {

    let checkData = this.userToken ? true : this.router.createUrlTree(['/login']);
    return checkData;
  }

}
