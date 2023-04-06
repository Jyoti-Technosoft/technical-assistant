import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';

import { DialogService } from 'src/app/dialog-service/dialog.service';
import dialogData from 'src/assets/json/dialogData.json';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  dialogData = { ...dialogData };
  userData: any;

  constructor(
    public questionService: AuthenticationService,
    public modalService: NgbModal,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.resultData();
    this.getData();
  }

  getData() {
    console.log(JSON.parse(localStorage.getItem('registerUser') as string));
    const data: any = localStorage.getItem('registerUser');
    this.userData = JSON.parse(data).find((data: any) => {
      return data.id == this.questionService.getUser();
    });
  }

  resultData() {
    let data: any = localStorage.getItem('result');
  }

  initialLetter(userName: string) {
    const intials = userName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
    return intials;
  }

  openEditDialog() {
    let configData: any = {};
    configData['userData'] = this.userData;
    this.dialogService.openDialog(configData);
  }
  ngOnDestroy(): void {}
}
