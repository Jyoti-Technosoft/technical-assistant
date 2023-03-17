import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { QuestionService } from 'src/app/service/question.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router : Router,
    private questionService : QuestionService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let isAuthenticate = localStorage.getItem('isAuthenticate')
    if(!isAuthenticate && this.questionService.getUser()){
      this.router.navigateByUrl('login');
      return false;
    }
    return true; 
   }
  
}
