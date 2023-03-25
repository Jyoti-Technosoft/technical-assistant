import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from 'src/app/service/authentication.service';
import { ToastService } from 'src/app/toast.service';
import dialogData from 'src/assets/json/dialogData.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  userData: any;
  dialogData = { ...dialogData };
  loginForm!: FormGroup;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    public toastService: ToastService
  ) {}

  formSubmitted(formValue: any) {
    let userdata = this.userData?.find(
      (value: any) =>
        value?.email == formValue?.emailId &&
        value?.password == formValue?.password
    );
    if (userdata) {
      this.toastService.showSuccessMessage('Login Successfully!');
      document.cookie = 'username' + '=' + userdata.id;
      localStorage.setItem('isAuthenticate', 'true');
      this.route.navigateByUrl('dashboard');
    } else {
      this.toastService.showErrorMessage('Wrong Credential!');
    }
  }

  ngOnInit(): void {
    this.createForm();
    if (localStorage.getItem('registerUser')) {
      this.userData = JSON.parse(
        localStorage.getItem('registerUser') as string
      );
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      emailId: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
        ]),
      ],
    });
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  ngOnDestroy(): void {}
}
