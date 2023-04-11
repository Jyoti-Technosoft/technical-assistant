import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';

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
  users = "http://localhost:3000/user";
  dialogData = { ...dialogData };
  loginForm!:FormGroup;
  message$: Observable<any> | undefined;
  destroyer$:ReplaySubject<boolean> = new ReplaySubject;
  state!: Observable<any>;
  error: any;
  

  constructor(
    private fb:FormBuilder,
    private store: Store<autenticationState>,
    private http: HttpClient
  ) {
    this.state = this.store.select(getStateSelector);
  }

  public formSubmitted(formValue: any) {
    this.store.dispatch(doLogoin(formValue));
  }

  ngOnInit(): void {
    this.createForm();
    this.http.get(this.users);
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [
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

  }


  get loginFormValidator() {
    return this.loginForm.controls;
  }


  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }

}

