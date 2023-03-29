import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import dialogData from '@assets/json/dialogData.json';

import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { autenticationState, getStateSelector } from '../../store/autentication/autentication.state';
import { doLogoin } from '@app/store/autentication/autentication.action';
import { DialogService } from '@app/dialog-service/dialog.service';

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
    private fb:FormBuilder,
    private store: Store<autenticationState>
  ) {
    this.state = this.store.select(getStateSelector);
  }

  public formSubmitted(formValue: any) {
    debugger
    this.store.dispatch(doLogoin(formValue));
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
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,15}$'
          ),
        ]),
      ],
    });

    this.message$ = this.store.select((state:any) => {return state.authentication});
    this.message$.pipe(takeUntil(this.destroyer$),distinctUntilChanged()).subscribe(state => {console.log("in login component",state)});
  }


  get loginFormValidator() {
    return this.loginForm.controls;
  }


  ngOnDestroy(): void {
    
  }

}

