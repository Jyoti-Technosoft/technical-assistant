import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { Subscription } from 'rxjs';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ToastService } from '@app/toast.service';
import { LOCALSTORAGE_KEY, PATTERN } from '@app/utility/utility';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  loginPage = true;
  sub: Subscription;
  hidePassword = true;
  hideConfirmPassword = true;
  isMobileView = false;
  steps: TemplateRef<any>[] = [];
  formSteps: any[] = [
    {label: 'Account', className:"account", link: 'assets/auth-images/account.svg'},
    {label:'Personal', className:"person", link: 'assets/auth-images/person.svg'},
    {label:'Finish', className:"finish", link: 'assets/auth-images/finish.svg'}
  ];
  @ViewChild('step1', { static: true }) step1Template!: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2Template!: TemplateRef<any>;
  @ViewChild('step3', { static: true }) step3Template!: TemplateRef<any>;
  currentStepIndex = 0;

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) {

    this.sub = new Subscription();
    this.auth.authStatusListener$.next(false);
  }

  ngOnInit(): void {

    this.auth.getScreenSize().subscribe(v => {
      this.isMobileView = v;
      this.cd.detectChanges();
    });

    this.steps.push(this.step1Template, this.step2Template, this.step3Template);
    this.createForm();
  }


  createForm(): void {

    if (this.loginPage) {
      this.loginForm = this.fb.group({
        email: ['mitali.jtdev@gmail.com', [Validators.required, Validators.pattern(PATTERN.EMAIL_PATTERN)]],
        password: ['Mitali@123', [Validators.required, Validators.minLength(8)]]
      });
    } else {
      this.registrationForm = this.fb.group({
        userCredential: this.fb.group({
          email: ['', [Validators.required, Validators.pattern(PATTERN.EMAIL_PATTERN)]],
          password: ['', [Validators.required, Validators.pattern(PATTERN.PASSWORD_PATTERN)]],
          confirmPassword: ['', Validators.required],
        }),
        personalInfo: this.fb.group({
          fullName: ['', [Validators.required, Validators.pattern(PATTERN.FULL_NAME_PATTERN)]],
          gender: ['', Validators.required],
          dateOfBirth: ['', Validators.required],
        }),
        extras: this.fb.group({
          mobile: ['', [Validators.required, Validators.pattern(PATTERN.MOBILE_PATTERN)]],
          acceptTerms: [false, Validators.requiredTrue],
        }),
      });
    }
    this.cd.detectChanges();
  }

  getLoginControl(field: string): any {
    return this.loginForm.get(field);
  }

  getUserDetailControl(form: string, field: string): any {
    return this.registrationForm.controls[form].get(field);
  }

  doLogin() : void {

    if (this.loginForm.valid) {

      const formValue = this.loginForm.getRawValue();
      const logUser = this.auth.getAllUser().subscribe({
        next: (res:any) => {
          let user = res.filter((v:any) => v.email === formValue.email && v.password === formValue.password);
          if (!!user.length) {
            this.toastService.show('success', 'Login successfully');
            localStorage.setItem(LOCALSTORAGE_KEY.USERDATA, JSON.stringify(user[0]));
            localStorage.setItem(LOCALSTORAGE_KEY.TOKEN, JSON.stringify(true));
            this.auth.authStatusListener$.next(true);
            this.router.navigateByUrl('dashboard');
          } else {
            this.toastService.show('success', 'Login successfully');
          }
        },
        error: () => {
          this.toastService.show('error', 'Login Error');
        }
      });
      this.sub.add(logUser);
    } else {
      this.loginForm.markAllAsTouched();
    }
    this.cd.detectChanges();
  }

  redirectTo(type: string): void {

    if (type === 'login') {
      this.loginPage = true;
      this.router.navigateByUrl('login');
      this.cd.detectChanges();
      this.createForm();
    } else {
      this.loginPage = false;
      this.router.navigateByUrl('registration');
      this.cd.detectChanges();
      this.createForm();
    }
  }

  submitUserData(): void {

    let user = this.registrationForm.getRawValue();

    const data = {
      'email': user.userCredential.email,
      'password': user.userCredential.password,
      'fullName': user.personalInfo.fullName,
      'gender': user.personalInfo.gender,
      'dob': user.personalInfo.dateOfBirth,
      'mobile': user.extras.mobile,
      'terms': user.extras.acceptTerms
    };

    const userData = this.auth.addUserData(data).subscribe({
      next: () => {
        this.toastService.show('success', 'Registation successfully');
        this.loginPage = true;
        this.router.navigateByUrl('login');
      },
      error: () => {
        this.toastService.show('error', 'Error while doing Registation');
      }
    });

    this.sub.add(userData);
  }

  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }
  }

  get currentStep(): TemplateRef<any> {
    return this.steps[this.currentStepIndex];
  }

  get isValid(): boolean {

    if (this.currentStepIndex == 0) {
      let pass = this.getUserDetailControl('userCredential','password');
      let confirmPass = this.getUserDetailControl('userCredential','password');

      if (pass.value === confirmPass.value && this.registrationForm.get('userCredential')?.valid) {
        return false;
      } else {
        return true;
      }
    } else if (this.currentStepIndex == 1) {
      return this.registrationForm.get('personalInfo')?.invalid || false;
    } else {
      return this.registrationForm.invalid || false;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}

