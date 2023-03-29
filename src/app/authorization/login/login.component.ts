import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/dialog-service/dialog.service';

import { ToastService } from 'src/app/toast.service';
import dialogData from 'src/assets/json/dialogData.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  userData: any;
  dialogData = { ...dialogData };
  loginForm!: FormGroup;
  
  constructor(
    private route: Router,
    public toastService: ToastService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {}

  public formSubmitted(formValue: any) {
    let userdata = this.userData?.find(
      (value: any) =>
        value?.email == formValue?.email &&
        value?.password == formValue?.password
    );

    if (userdata) {
      document.cookie = 'Username' + '=' + userdata.id;
      localStorage.setItem('isAuthenticate', 'true');
      this.route.navigateByUrl('dashboard');
    } else {
      this.toastService.showErrorMessage('Wrong Credential!');
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
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}$'
          ),
        ]),
      ],
    });
  }

  get loginFormValidator() {
    return this.loginForm.controls;
  }

  ngOnDestroy(): void {}
}
