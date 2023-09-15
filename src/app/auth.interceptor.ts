import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthenticationService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.auth.getAuthToken();
    const skipIntercept = request.headers.has('skip');
    let req1;

    if (skipIntercept) {

      req1 = request.clone({
          headers: request.headers.delete('skip')
      });

    } else {

      if (!token) {
        return next.handle(request);
      }
      req1 = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
    }
    return next.handle(req1);
  }
}
