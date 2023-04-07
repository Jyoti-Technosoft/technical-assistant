import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, distinctUntilChanged, takeUntil } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '@app/service/authentication.service';
import { autenticationState } from '@app/store/autentication/autentication.state';
import { updateUserDetails } from '@app/store/autentication/autentication.action';
import { RegisteredPayload } from '@app/store/autentication/autentication.model';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  loggedInUser$: Observable<RegisteredPayload> | undefined;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();
  profilePageForm!: FormGroup;
  showPasswordField: boolean = false;
  userData:RegisteredPayload | undefined; 

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    private store: Store<autenticationState>,
    private fb: FormBuilder,
    public calendar: NgbCalendar
  ) {}

  @ViewChild('datePicker') datePicker!: any;

  ngAfterViewInit(): void {
    this.profilePageForm.disable();
  }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.loggedInUser$ = this.store.select(
      (state: any) => state.authentication.userData
    );
    this.loggedInUser$
      .pipe(takeUntil(this.destroyer$), distinctUntilChanged())
      .subscribe((state) => {
        this.userData = state;
        this.initForm(state);
      });
  }

  validateConfirmaPassword() {
    const password = this.profilePageForm?.controls['newPassword'];
    const confirmPassword = this.profilePageForm?.controls['confirmPassword'];
    password?.value !== confirmPassword?.value
      ? confirmPassword?.setErrors({ validateConfirmaPassword: true })
      : confirmPassword?.setErrors(null);
  }

  validateNewPassword() {
    const password = this.profilePageForm?.controls['password'];
    const newPassword = this.profilePageForm?.controls['newPassword'];
    password?.value == newPassword?.value
      ? newPassword?.setErrors({ duplicatePassword: true })
      : newPassword?.setErrors(null);
  }

  validateNumber: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[123456789]\d{9}$/;
    return regex.test(control.value) ? null : { pattern: true };
  };

  initForm(data?: any) {
    this.profilePageForm = this.fb.group({
      dateOfBirth: [
        data?.dateOfBirth || '',
        Validators.compose([Validators.required]),
      ],
      email: [
        data?.email || '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      fullName: [
        data?.fullName || '',
        Validators.compose([Validators.required]),
      ],
      gender: [data?.gender || '', Validators.compose([Validators.required])],
      id: [data?.id || ''],
      mobile: [
        data?.mobile || '',
        Validators.compose([Validators.required, this.validateNumber]),
      ],
    });
    if (this.showPasswordField) {
      this.appendFormFieldForPassword();
    }
  }

  getUserLetter(userName: string) {
    const intials = userName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
    return intials;
  }

  onHideShow() {
    this.appendFormFieldForPassword();
    this.showPasswordField = true;
  }

  appendFormFieldForPassword() {
    this.profilePageForm.addControl(
      'password',
      this.fb.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,15}$'
          ),
        ])
      )
    );
    this.profilePageForm.addControl(
      'newPassword',
      this.fb.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,15}$'
          ),
        ])
      )
    );
    this.profilePageForm.addControl(
      'confirmPassword',
      this.fb.control('', Validators.compose([Validators.required]))
    );

    this.profilePageForm
      ?.get('newPassword')
      ?.valueChanges?.subscribe((data) => {
        this.validateConfirmaPassword();
        this.validateNewPassword();
      });
    this.profilePageForm
      ?.get('confimrPassword')
      ?.valueChanges?.subscribe((data) => {
        this.validateConfirmaPassword();
      });
  }

  deleteFormFieldForPassword() {
    this.profilePageForm.removeControl('password');
    this.profilePageForm.removeControl('newPassword');
    this.profilePageForm.removeControl('confirmPassword');
  }

  updateUserDetails() {
    this.store.dispatch(
      updateUserDetails({ user: this.profilePageForm?.value })
    );
  }
  cancelUpdate() {
    this.initForm(this.userData);
    this.profilePageForm.disable();
    this.deleteFormFieldForPassword();
    this.showPasswordField = false;
  }

  editUserdetails() {
    this.profilePageForm.enable();
  }

  setTodaysDate() {
    this.profilePageForm.controls['dateOfBirth'].patchValue(
      this.calendar.getToday()
    );
    this.datePicker?.close();
  }

  get profilePageFormController() {
    return this.profilePageForm.controls;
  }
}
