import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthenticationService } from 'src/app/service/authentication.service';
import { ToastService } from 'src/app/toast.service';
import dialogData from 'src/assets/json/dialogData.json';
import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { doLogoin } from 'src/app/store/autentication/autentication.action';
import { autenticationState, getStateSelector } from '../../store/autentication/autentication.state';
import { DialogService } from 'src/app/dialog-service/dialog.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  userData: any;
  dialogData = { ...dialogData };
  loginForm!:FormGroup;
  message$: Observable<any> | undefined;
  destroyer$:ReplaySubject<boolean> = new ReplaySubject;
  state!: Observable<any>;
  error: any;
  

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    public toastService: ToastService,
    private dialogService: DialogService,
    private store: Store<autenticationState>
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

    this.message$ = this.store.select((state:any) => {return state.authentication});
    this.message$.pipe(takeUntil(this.destroyer$),distinctUntilChanged()).subscribe(state => {console.log("in login component",state)});
  }

  login() {
    this.store.dispatch(doLogoin(this.loginForm.value));
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  ngOnDestroy(): void {}
}

