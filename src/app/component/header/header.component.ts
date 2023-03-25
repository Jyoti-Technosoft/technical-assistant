import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService } from 'src/app/dialog-service/dialog.service';
import dialogData from 'src/assets/json/dialogData.json'
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  userName: any;
  dialogData = { ...dialogData };
  userData: any;
  constructor(
    private route: Router,
    public authenticationService: AuthenticationService,
    private dialogService: DialogService
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
      (data: any) => data?.id
    )?.fullName;
  }

  about(){
    let configData = this.dialogData.aboutModel;
      this.dialogService
        .openDialog(configData)
        .then((value) => {
          if (value) {
            
          }
        });
  }

  signout() {
    let configData = this.dialogData.signoutModel;
      this.dialogService
        .openDialog(configData)
        .then((value) => {
          if (value) {
            this.route.navigateByUrl('login');
            localStorage.removeItem('isAuthenticate');
            document.cookie = 'username' + '=' + null;
          }
        });
    }
  }
