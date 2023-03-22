import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { DialogService } from 'src/app/dialog-service/dialog.service';
import dialogData from 'src/assets/json/dialogData.json';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  userData: any;
  dialogData = { ...dialogData };
  adminForm!:FormGroup;

  constructor(
    private route: Router,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {}

  public formSubmitted() {
    let userdata = this.userData?.find(
      (value: any) => value?.email ==  this.adminForm?.value?.email && value?.password ==  this.adminForm?.value?.password 
    );
    if (
      userdata
      ) {
      document.cookie = "username" + "=" + userdata.id;
      localStorage.setItem('isAuthenticate', 'true');
      this.route.navigateByUrl('dashboard');
    } else {
      let configData = this.dialogData.loginModel;
      this.dialogService
        .openDialog(configData)
        .then((value) => {
          if (value) {
            this.route.navigateByUrl('registration');
          } else {
            this.adminForm?.reset();
          }
        });
    }
  }

  ngOnInit(): void {
    if (!localStorage.getItem('registeruser')?.length) {
      let registeruser: any = localStorage.getItem('registeruser');
      registeruser = JSON.parse(registeruser as string);
      alert('There is no user create one');
      this.route.navigateByUrl('registration');
    } else {
      let data: any = localStorage.getItem('registeruser');
      this.userData = JSON.parse(data);
    }
    this.createForm();
  }

  createForm() {
     this.adminForm = this.fb.group({
      email : [''],
      password : ['']
     })
  }


  ngOnDestroy(): void {
  }

}
