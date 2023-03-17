import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Injectable({
  providedIn: 'root'
})
export class NonauthGuard implements CanActivate {
 
  constructor(
    private router : Router,
    private questionService:QuestionService
  )
  {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isAuthenticate = localStorage.getItem('isAuthenticate');
      if(isAuthenticate && this.questionService.getUser()){
        this.router.navigateByUrl('dashboard');
        return false;
      }
      return true;
  }
  
}
