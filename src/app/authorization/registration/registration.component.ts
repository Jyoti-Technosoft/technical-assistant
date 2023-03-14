import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  email: any;
  pwd: any;
  fullname: any;
  cpwd: any;
  gender: any;
  birthday: any;
  mobile: any;
  registeruser: any = [];
  registrationForm!: FormGroup;
  submitted = false;
  acceptTerms: any;

  constructor(private route: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  public submitform() {
    const formValue = this.registrationForm.value;

    if (localStorage.getItem('registeruser') == null) {
      this.registeruser = [];
    } else {
      this.registeruser = JSON.parse(
        localStorage.getItem('registeruser') as string
      );
    }
    this.registeruser.push({
      id: formValue.id,
      fullname: formValue.fullname,
      email: formValue.email,
      cpwd: formValue.cpwd,
      password: formValue.pwd,
      gender: formValue.gender,
      birthday: formValue.birthday,
      mobile: formValue.mobile,
    });
    localStorage.setItem('registeruser', JSON.stringify(this.registeruser));
    this.route.navigateByUrl('login');

    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }
  }

  identityRevealedValidator: ValidatorFn = (
    controls: AbstractControl
  ): ValidationErrors | null => {
    const pwd = this.registrationForm?.controls['pwd'];
    return pwd?.value !== controls?.value ? { identityRevealed: true } : null;
  };

  validateNumber: ValidatorFn = (
    controls: AbstractControl
  ): ValidationErrors | null => {
    const regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[123456789]\d{9}$/;
    return regex.test(controls.value) ? null : { pattern: true };
  };

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
  disableDate() {
    return false;
  }
  Submited() {
    console.log(this.registrationForm);
    console.log(
      this.registrationForm.value.fullname,
      this.registrationForm.value.email,
      this.registrationForm.value.pwd,
      this.registrationForm.value.cpwd,
      this.registrationForm.value.gender,
      this.registrationForm.value.birthday,
      this.registrationForm.value.mobile
    );
  }

  createForm() {
    this.registrationForm = this.fb.group({
      id: new FormControl(Date.now()),
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
        Validators.compose([
          Validators.required,
          this.identityRevealedValidator,
        ]),
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
  get f() {
    return this.registrationForm.controls;
  }

  get registrationFormValidator() {
    return this.registrationForm.controls;
  }
}
