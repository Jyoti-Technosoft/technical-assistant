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

import { DialogService } from 'src/app/dialog-service/dialog.service';

import dialogData from 'src/assets/json/dialogData.json';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registeruser: any = [];
  registrationForm!: FormGroup;
  dialogData = { ...dialogData };
  @ViewChild('email') email!: ElementRef;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getRegistredUser();
  }

  getRegistredUser() {
    if (!localStorage.getItem('registeruser')) {
      this.registeruser = [];
    } else {
      this.registeruser = JSON.parse(
        localStorage.getItem('registeruser') as string
      );
    }
  }

  public submitform(formValue: any) {
    let findUser = this.registeruser?.find(
      (value: any) => value.email == formValue.email
    );
    if (findUser) {
      let label = this.dialogData.emailModel.label;
      let yesButtonLable = this.dialogData.emailModel.yesButtonLable;
      let NoButtonLable = this.dialogData.emailModel.NoButtonLable;
      this.dialogService
        .openDialog(label, yesButtonLable, NoButtonLable)
        .then((value) => {
          if (value) {
            setTimeout(() => {
              this.email.nativeElement.focus();
            });
          }
        });
    } else {
      this.registeruser.push(formValue);
      localStorage.setItem('registeruser', JSON.stringify(this.registeruser));
      this.route.navigateByUrl('login');
    }
  }

  confirmationValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const pwd = this.registrationForm?.controls['pwd'];
    return pwd?.value !== control?.value
      ? { confirmationValidator: true }
      : null;
  };

  validateNumber: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[123456789]\d{9}$/;
    return regex.test(control.value) ? null : { pattern: true };
  };

  getToday(): string {
    return new Date().toISOString().slice(0, 10);
  }

  createForm() {
    this.registrationForm = this.fb.group({
      id: [Date.now()],
      fullname: ['', [Validators.required]],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      pwd: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}$'
          ),
        ]),
      ],
      cpwd: [
        '',
        Validators.compose([Validators.required, this.confirmationValidator]),
      ],
      gender: ['', Validators.compose([Validators.required])],
      birthday: ['', Validators.compose([Validators.required])],
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
