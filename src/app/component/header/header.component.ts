import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { DialogService } from '@app/dialog-service/dialog.service';
import dialogData from '@assets/json/dialogData.json';
import { AuthenticationService } from '@app/service/authentication.service';
import { autenticationState } from '@app/store/autentication/autentication.state';
import { doLogout } from '@app/store/autentication/autentication.action';

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
    private dialogService: DialogService,
    private store: Store<autenticationState>
  ) {}

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    let data: any = localStorage.getItem('registerUser');
    this.userData = JSON.parse(data);
    let userId: any = this.authenticationService.getUser();

    this.userName = this.userData?.find(
      (data: any) => data?.id == userId
      )?.email;

    }

  openAboutDialog() {
    let configData = this.dialogData.aboutModel;
    this.dialogService.openDialog(configData);
  }

  
  openSignOutDialog() {
    let configData = this.dialogData.signoutModel;
    this.dialogService.openDialog(configData).then((value) => {
      if (value) {
        this.store.dispatch(doLogout())
      }
    });
  }
}