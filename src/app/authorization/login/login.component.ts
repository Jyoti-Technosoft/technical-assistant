import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { DialogService } from 'src/app/dialog-service/dialog.service';
import dialogData from 'src/assets/json/dialogData.json';
import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { doLogoin } from 'src/app/store/autentication/autentication.action';
import { autenticationState, getStateSelector } from '../../store/autentication/autentication.state';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    private dialogService: DialogService,
    private fb:FormBuilder,
    private store: Store<autenticationState>
  ) {
    this.state = this.store.select(getStateSelector);
  }

  public formSubmitted(formValue:any) {
    let userdata = this.userData?.find(
      (value: any) => value?.email ==  formValue?.emailId && value?.password ==  formValue?.password 
    );
    if (userdata) {
      document.cookie = 'username' + '=' + userdata.id;
      localStorage.setItem('isAuthenticate', 'true');
      this.route.navigateByUrl('dashboard');
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

    this.message$ = this.store.select((state:any) => {return state.authentication});
    this.message$.pipe(takeUntil(this.destroyer$),distinctUntilChanged()).subscribe(state => {console.log("in login component",state)});
  }

  login() {
    this.store.dispatch(doLogoin(this.loginForm.value));
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  ngOnDestroy(): void {
    
  }

}

