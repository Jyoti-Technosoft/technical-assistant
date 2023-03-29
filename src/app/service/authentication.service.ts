import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor() {}

  ngOnInit(): void {}

  getUser(): string {
    return document.cookie.split('=')[1];
  }
}
