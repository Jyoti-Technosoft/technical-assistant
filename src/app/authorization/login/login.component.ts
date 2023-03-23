import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DialogService } from 'src/app/dialog-service/dialog.service';
import dialogData from 'src/assets/json/dialogData.json';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  userData: any;
  dialogData = { ...dialogData };
  loginForm!:FormGroup;
  
  constructor(
    private route: Router,
    private dialogService: DialogService,
    private fb:FormBuilder
  ) {}

  public formSubmitted(formValue:any) {
    let userdata = this.userData?.find(
      (value: any) => value?.email ==  formValue?.emailId && value?.password ==  formValue?.password 
    );
    if (userdata) {
      document.cookie = 'username' + '=' + userdata.id;
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
            this.loginForm?.reset();
          }
        });
    }
  }

  ngOnInit(): void {
    this.createForm();
    if (localStorage.getItem('registerUser')?.length) {
      let data: any = localStorage.getItem('registerUser');
      this.userData = JSON.parse(data);
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      emailId: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])]
    });
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  ngOnDestroy(): void {
  }

}
