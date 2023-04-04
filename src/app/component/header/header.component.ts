import { Component, EventEmitter, Input, Output, Renderer2, ViewChild } from "@angular/core";
import { Router } from '@angular/router';

import { DialogService } from 'src/app/dialog-service/dialog.service';
import dialogData from 'src/assets/json/dialogData.json';
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
  @ViewChild('rowExpand') rowExpand:any ;
  isRowExpand!: boolean;
  constructor(
    private route: Router,
    public authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private elemenRef : Renderer2
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    let data: any = localStorage.getItem('registerUser');
    this.userData = JSON.parse(data);
    let userId: any = this.authenticationService.getUser();
    this.userName = this.userData?.find(
      (data: any) => data?.id == userId
    )?.fullName;
  }

  openAboutDialog() {
    let configData = this.dialogData.aboutModel;
    this.dialogService.openDialog(configData);
  }

  expandRow() {
    if(this.isRowExpand) {
      this.isRowExpand = false;
      this.elemenRef.removeClass(this.rowExpand.nativeElement, 'in');
    } else {
      this.isRowExpand = true;
      this.elemenRef.addClass(this.rowExpand.nativeElement, 'in');
    } 
  }

  getUserLetter(userName: string) {
    const intials = userName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
    return intials;
  }

  openSignOutDialog() {
    debugger
    let configData = this.dialogData.signoutModel;
    this.dialogService.openDialog(configData).then((value) => {
      if (value) {
        this.route.navigateByUrl('login');
        localStorage.removeItem('isAuthenticate');
        document.cookie = 'username' + '=' + null;
      }
    });
  }
}
