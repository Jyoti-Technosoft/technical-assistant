import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class NonAuthGuard  {

  userData!: boolean;
  userToken!: boolean;

  constructor(
    private router: Router,
    private auth: AuthenticationService
  ) {
    // this.auth.getAuthStatusListener().subscribe(v => {
    //   this.userData = v;
    // });

    // this.userToken = JSON.parse(JSON.stringify(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN)));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

      // if (this.userToken === false) {
      //   return true;
      // } else {
      //   this.router.navigateByUrl('/login');
      //   return false;
      // }
      return true;
  }
}
