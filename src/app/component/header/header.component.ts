import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { QuestionService } from '../../service/question.service';
import { DialogService } from 'src/app/dialog-service/dialog.service';
import dialogData from 'src/assets/json/dialogData.json'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
    let userId: any = this.questionService.getUser();
    this.userName = this.userData?.find(
      (data: any) => data?.id == userId
    )?.fullname;
  }

  signout() {
    localStorage.removeItem('isAuthenticate');
    document.cookie = 'username' + '=' + null;
    let configData = this.dialogData.signoutModel;
      this.dialogService
        .openDialog(configData)
        .then((value) => {
          if (value) {
            this.route.navigateByUrl('registration');
          }
        });
    }
  }
