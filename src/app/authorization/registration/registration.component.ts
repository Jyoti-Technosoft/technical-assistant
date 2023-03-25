import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ToastService } from 'src/app/toast.service';
import dialogData from 'src/assets/json/dialogData.json';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent {
  todayDate: string | undefined = new Date().toISOString().slice(0,10);
  registerUser: any[] = [];
  registrationForm!: FormGroup;
  dialogData = { ...dialogData };
  @ViewChild('email') email!: ElementRef;
  
  constructor(private route: Router,
    private fb: FormBuilder,
    private toastService: ToastService
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
    let findUser = this.registerUser?.find(
      (value: any) => value.email == formValue.email
    );
    if (findUser) {
      this.toastService.showErrorMessage('This email id is already registered');
      setTimeout(() => {
        this.email.nativeElement.focus();
      });
    } else {
      this.toastService.showSuccessMessage('Registered Successfully');
      this.registerUser.push(formValue);
      localStorage.setItem('registerUser', JSON.stringify(this.registerUser));
    }
  }

  validateConfirmaPassword: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = this.registrationForm?.controls['password'];
    return password?.value !== control?.value
      ? { validateConfirmaPassword: true }
      : null;
  };

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
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}$'
          ),
        ]),
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.required,
          this.validateConfirmaPassword,
        ]),
      ],
      gender: ['', Validators.compose([Validators.required])],
      dateOfBirth: ['', Validators.compose([Validators.required])],
      mobile: [
        '',
        Validators.compose([Validators.required, this.validateNumber]),
      ],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  get registrationFormValidator() {
    return this.registrationForm.controls;
  }
}

 

 
