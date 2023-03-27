import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  
constructor() {}

  ngOnInit(): void {}

  getUser(): number | undefined {
    return Number(document.cookie.split('=')[1]) != 0 ? Number(document.cookie.split('=')[1]) : undefined ;
  }
}
