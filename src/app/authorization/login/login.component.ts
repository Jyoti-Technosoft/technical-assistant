import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { Subscription } from 'rxjs';
import { LOCALSTORAGE_KEY, PATTERN } from '@app/utility/utility';
import { SnackbarService } from '@app/service/snackbar.service';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MAT_DATE_FORMATS } from '@angular/material/core';

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
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  isApiCalling = false;
  loginPage!: boolean;
  sub: Subscription;
  hidePassword = true;
  hideConfirmPassword = true;
  isMobileView = false;
  displayErrorMess: any;
  currentDate = new Date();
  currentStepIndex = 0;

  @ViewChild('stepper')
  stepper!: MatStepper;

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private snackbarService: SnackbarService,
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

    localStorage.removeItem('terms');
    this.loginPage = this.router.url.includes('login') ? true : false;
    this.createForm();

    this.stepper?.selectionChange.subscribe((event: StepperSelectionEvent) => {
      this.currentStepIndex = event.selectedIndex;
    });
  }


  createForm(): void {

    if (this.loginPage) {

      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.pattern(PATTERN.EMAIL_PATTERN)]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      });

      this.loginForm.get('email')?.valueChanges.subscribe(() => {
        this.displayErrorMess = '';
      });

      this.cd.detectChanges();

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

      this.registrationForm.controls['userCredential'].get('email')?.valueChanges.subscribe(() => {
        this.displayErrorMess = '';
      });

      this.cd.detectChanges();
    }
  }

  getLoginControl(field: string): any {
    return this.loginForm.get(field);
  }

  getUserDetailControl(form: string, field: string): any {
    return this.registrationForm?.controls[form]?.get(field);
  }

  doLogin() : void {

    if (this.loginForm.valid) {

      this.isApiCalling = true;
      const formValue = this.loginForm.getRawValue();
      const logUser = this.auth.logInUser(formValue).subscribe({
        next: (res:any) => {
          if (res.success) {
            this.isApiCalling = false;
            this.snackbarService.success(res.message);
            localStorage.setItem(LOCALSTORAGE_KEY.USERID, res.data.user_id);
            localStorage.setItem(LOCALSTORAGE_KEY.TOKEN, res.data.token);
            this.router.navigateByUrl('layout');
          } else {
            this.isApiCalling = false;
            this.snackbarService.error(res.message);
          }
          this.cd.detectChanges();
        },
        error: (err) => {
          this.isApiCalling = false;
          this.displayErrorMess = err.error.message;
          this.snackbarService.error(err.error.message);
          this.cd.detectChanges();
        }
      });
      this.sub.add(logUser);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  redirectTo(type: string): void {

    switch(type) {

      case 'login':
        {
          this.loginPage = true;
          this.displayErrorMess = '';
          this.router.navigateByUrl('login');
          this.createForm();
        }
        break;

      case 'new':
        {
          this.loginPage = false;
          this.displayErrorMess = '';
          this.router.navigateByUrl('registration');
          this.createForm();
        }
        break;

      case 'privacy-policy':
        {
          localStorage.setItem('terms', 'true');
          const url = this.router.serializeUrl(
            this.router.createUrlTree([`privacy-policy`])
          );
          window.open(url, '_blank');
        }
        break;

      case 'tearms-condition':
        {
          localStorage.setItem('terms', 'true');
          const url = this.router.serializeUrl(
            this.router.createUrlTree([`tearms-condition`])
          );
          window.open(url, '_blank');
        }
    }
  }

  submitUserData(): void {

    this.isApiCalling = true;
    let user = this.registrationForm.getRawValue();
    const data = {
      'name': user.personalInfo.fullName,
      'email': user.userCredential.email,
      'password': user.userCredential.password,
      'gender': user.personalInfo.gender,
      'birth_date': user.personalInfo.dateOfBirth,
      'contact': user.extras.mobile,
    };

    const userData = this.auth.registerUser(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.loginPage = true;
          this.snackbarService.success(res.message);
          this.router.navigateByUrl('login');
          this.isApiCalling = false;
        } else  {
          this.snackbarService.error(res.message);
          this.isApiCalling = false;
        }
      },
      error: (err) => {
        this.displayErrorMess = err.error.message;
        this.snackbarService.error(err.error.message);
      }
    });

    this.sub.add(userData);
  }

  nextStep(): void {

    if (this.currentStepIndex === 0) {
      if (this.registrationForm.controls['userCredential'].valid) {
        const userEmail = this.registrationForm.getRawValue().userCredential.email;
        let data = {
          email: userEmail
        }
        const userData = this.auth.checkUserEmail(data).subscribe({
          next: (res) => {
            if (!res.isAlreadyRegistered) {
              this.currentStepIndex ++;
              this.stepper.selectedIndex = this.currentStepIndex;
              this.cd.detectChanges();
            } else  {
              this.displayErrorMess = 'This email is already exists';
              this.cd.detectChanges();
              this.snackbarService.error('This email is already exists');
              this.isApiCalling = false;
            }
          },
          error: (err) => {
            this.snackbarService.error(err.error.message);
            this.isApiCalling = false;
          }
        });

        this.sub.add(userData);
      }
    } else {
      this.currentStepIndex ++;
      this.stepper.selectedIndex = this.currentStepIndex;
    }
  }

  backStep(): void {
    this.currentStepIndex --;
    this.stepper.selectedIndex = this.currentStepIndex;
  }

  get isValid(): boolean {

    if (this.currentStepIndex == 0) {
      let pass = this.getUserDetailControl('userCredential','password');
      let confirmPass = this.getUserDetailControl('userCredential','confirmPassword');

      if (pass.value === confirmPass.value && this.registrationForm.get('userCredential')?.valid) {
        return false;
      } else {
        return true;
      }
    } else if (this.currentStepIndex == 1) {
      return this.registrationForm.get('personalInfo')?.invalid || false;
    } else {
      return this.registrationForm.get('extras')?.invalid || false;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}

