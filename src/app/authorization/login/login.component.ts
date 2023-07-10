import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import dialogData from '@assets/json/dialogData.json';

import { Observable, ReplaySubject } from 'rxjs';
import {
  autenticationState,
  getStateSelector,
} from '../../store/autentication/autentication.state';
import { doRegistration } from '@app/store/autentication/autentication.action';
import { doLogoin } from '@app/store/autentication/autentication.action';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { REDIRECT_PAGE } from '@app/authorization/login/login.enum';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})


export class LoginComponent implements OnInit, OnDestroy {
  userData: any;
  dialogData = { ...dialogData };
  loginForm!: FormGroup;
  message$: Observable<any> | undefined;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();
  state!: Observable<any>;
  error: any;
  isSignUp: boolean = false;
  buttonType: String = 'button';
  @ViewChild('datePicker') datePicker!: any;
  @ViewChild('step1', { static: true }) step1Template!: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2Template!: TemplateRef<any>;
  @ViewChild('step3', { static: true }) step3Template!: TemplateRef<any>;

  steps: TemplateRef<any>[] = [];
  currentStepIndex = 0;
  registrationForm!: FormGroup;
  formSteps: any[] = ['Account', 'Personal', 'Finish'];

  constructor(
    private fb: FormBuilder,
    private store: Store<autenticationState>,
    public calendar: NgbCalendar,
    private router: Router
  ) {
    this.state = this.store.select(getStateSelector);
  }

  public formSubmitted(formValue: any) {
    this.store.dispatch(doLogoin(formValue));
  }

  ngOnInit(): void {
    if (localStorage.getItem('registerUser')) {
      this.userData = JSON.parse(
        localStorage.getItem('registerUser') as string
      );
    }
    this.steps.push(this.step1Template, this.step2Template, this.step3Template);
    this.redirectPage();
  }

  redirectPage() {
    if (this.router.url == REDIRECT_PAGE.REDIRECT_LOGIN_PAGE) {
      this.createForm();
      this.isSignUp = false;
    }
    else if (this.router.url == REDIRECT_PAGE.REDIRECT_REGISTRATION_PAGE) {
      this.createRegistrationForm();
      this.isSignUp = true;
    }
  }
  createRegistrationForm() {
    this.registrationForm = this.fb.group({
      userCredential: this.fb.group({
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
        confirmPassword: [
          '',
          Validators.compose([
            Validators.required,
            // this.validateConfirmaPassword,
          ]),
        ],
      }),
      personalInfo: this.fb.group({
        fullName: ['', [Validators.required]],
        gender: ['', Validators.compose([Validators.required])],
        dateOfBirth: ['', Validators.compose([Validators.required])],
        mobile: [
          '',
          // Validators.compose([Validators.required, this.validateNumber]),
        ],
      }),
      extras: this.fb.group({
        acceptTerms: [false, Validators.requiredTrue],
      }),
    });
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
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

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }
  }

  get currentStep(): TemplateRef<any> {
    return this.steps[this.currentStepIndex];
  }

  get loginFormValidator() {
    return this.loginForm.controls;
  }

  get personalInfo(): FormGroup {
    return this.registrationForm.get('personalInfo') as FormGroup;
  }

  get userCredential(): FormGroup {
    return this.registrationForm.get('userCredential') as FormGroup;
  }

  get policy(): FormGroup {
    return this.registrationForm.get('extras') as FormGroup;
  }

  get isValid(): boolean {
    if (this.currentStepIndex == 0) {
      this.buttonType = 'button';
      return this.registrationForm.get('userCredential')?.invalid || false;
    } else if (this.currentStepIndex == 1) {
      this.buttonType = 'button';
      return this.registrationForm.get('personalInfo')?.invalid || false;
    } else {
      this.buttonType = 'submit';
      return this.registrationForm.invalid || false;
    }
  }

  submitform(formValue: any) {
    let registerUser = {
      id: Date.now().toString(),
      fullName: formValue.personalInfo.fullName,
      email: formValue?.userCredential?.email,
      password: window.btoa(JSON.stringify(formValue?.userCredential?.confirmPassword)),
      gender: formValue?.personalInfo?.gender,
      dateOfBirth: formValue?.personalInfo?.dateOfBirth,
      mobile: formValue?.personalInfo?.mobile,
    };
    console.log(registerUser)
    this.store.dispatch(doRegistration(registerUser));
  }

  setTodaysDate() {
    this.registrationForm.controls['dateOfBirth'].patchValue(
      this.calendar.getToday()
    );
    this.datePicker?.close();
  }

  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }

}

