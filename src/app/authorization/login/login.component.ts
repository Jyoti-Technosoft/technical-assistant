import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private fb:FormBuilder
  ) {}


  public formSubmitted() {
    let userdata = this.userData?.find(
      (value: any) => value?.email ==  this.adminForm?.value?.emailId && value?.password == this.adminForm?.value?.password 
    );
    if (
      userdata
      ) {
      document.cookie = "username" + "=" + userdata.id;
      localStorage.setItem('isAuthenticate', 'true');
      this.route.navigateByUrl('/dashboard');
    } else {
      let label = this.dialogData.loginModel.label;
      let yesButtonLable = this.dialogData.loginModel.yesButtonLable;
      let NoButtonLable = this.dialogData.loginModel.NoButtonLable;
      this.dialogService
        .openDialog(label, yesButtonLable, NoButtonLable)
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
    if (!localStorage.getItem('registerUser')?.length) {
      let registerUser: any = localStorage.getItem('registerUser');
      registerUser = JSON.parse(registerUser as string);
      alert('There is no user create one');
      this.route.navigateByUrl('/registration');
    } else {
      let data: any = localStorage.getItem('registerUser');
      this.userData = JSON.parse(data);
    }
    
  }

  signout() {
    localStorage.removeItem('isAuthenticate');
    document.cookie = 'username' + '=' + null;
    this.route.navigateByUrl('/login');
  }

  createForm() {
    this.adminForm = this.fb.group({
      emailId: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])]
    });
  }

  get adminFormValidator() {
    return this.adminForm.controls;
  }
  
  ngOnDestroy(): void {
  }

}
