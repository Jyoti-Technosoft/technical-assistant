import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

   constructor(
    private router : Router
   ){}
   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    let isAuthenticate = localStorage.getItem('isAuthenticate')
    if(!isAuthenticate){
      this.router.navigateByUrl('login');
            
      return false;
    } 
    return true;
   }
}
