import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { QuestionService } from '../../service/question.service';
import { DialogService } from 'src/app/dialog-service/dialog.service';
import dialogData from 'src/assets/json/dialogData.json'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userName: any;
  dialogData = { ...dialogData };
  userData: any;
  constructor(private route: Router, public questionService: QuestionService,private dialogService: DialogService,) {}

  ngOnInit() {
      this.getData();   
  }

  getData() {
    let data:any = localStorage.getItem('registerUser');
    this.userData = JSON.parse(data);
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
