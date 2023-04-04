import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';

import dialogData from '@assets/json/dialogData.json';
import { doRegistration } from '@app/store/autentication/autentication.action';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  todayDate: string | undefined = new Date().toISOString().slice(0, 10);
  registerUser: any[] = [];
  registrationForm!: FormGroup;
  dialogData = { ...dialogData };
  @ViewChild("datePicker") datePicker!: any 
  constructor(
    private fb: FormBuilder,
    private store: Store,
    public calendar: NgbCalendar
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getRegistredUser();
  }

  getRegistredUser() {
    if (localStorage.getItem('registerUser')) {
      this.registerUser = JSON.parse(
        localStorage.getItem('registerUser') as string
      );
    }
  }

  submitform(formValue: any) {
    let registerUser = {
      id: formValue.id,
      fullName: formValue.fullName,
      email: formValue?.email,
      password: window.btoa(JSON.stringify(formValue?.confirmPassword)),
      gender: formValue?.gender,
      dateOfBirth: formValue?.dateOfBirth,
      mobile: formValue?.mobile,
    }
    this.store.dispatch(doRegistration(registerUser))
  }

  validateConfirmaPassword() {
    const password = this.registrationForm?.controls['password'];
    const confirmPassword = this.registrationForm?.controls['confirmPassword'];
    password?.value != confirmPassword?.value
      ? confirmPassword?.setErrors({ pattern: true })
      : confirmPassword?.setErrors(null);
  }

  validateNumber: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[123456789]\d{9}$/;
    return regex.test(control.value) ? null : { pattern: true };
  };

  createForm() {
    this.registrationForm = this.fb.group({
      id: [Date.now()],
      fullName: ['', [Validators.required]],
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
      confirmPassword: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      dateOfBirth: ['', Validators.compose([Validators.required])],
      mobile: [
        '',
        Validators.compose([Validators.required, this.validateNumber]),
      ],
      acceptTerms: [false, Validators.requiredTrue],
    });
    this.registrationForm
      .get('password')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.validateConfirmaPassword();
      });
    this.registrationForm
      .get('confirmPassword')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.validateConfirmaPassword();
      });
  }

  get registrationFormValidator() {
    return this.registrationForm.controls;
  }

  setTodaysDate() {
    this.registrationForm.controls['dateOfBirth'].patchValue(this.calendar.getToday()); 
    this.datePicker?.close();
  }
}
