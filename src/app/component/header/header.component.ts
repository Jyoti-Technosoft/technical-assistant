import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  userName: any;
  userData: any;
  constructor(
    private route: Router,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    if (!this.userName) {
    }
  }

  getData() {
    let data: any = localStorage.getItem('registerUser');
    this.userData = JSON.parse(data);
    let userId: any = this.authenticationService.getUser();
    this.userName = this.userData?.find(
      (data: any) => data?.id == userId
    )?.fullName;
  }
  signout() {
    localStorage.removeItem('isAuthenticate');
    document.cookie = 'username' + '=' + null;
    this.route.navigateByUrl('/login');
  }
}
