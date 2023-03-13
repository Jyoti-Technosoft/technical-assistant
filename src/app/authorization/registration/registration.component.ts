import { Component } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
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

  data = {
    fullname: '',
    email: '',
    pwd: '',
    cpwd: '',
    gender: '',
    birthday: '',
    mobile: '',
  };
  registrationForm!: FormGroup;

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.initForm();
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
  }


  initForm() {
    this.registrationForm = new FormGroup(
      {
        id: new FormControl(Date.now()),
        fullname: new FormControl('', [
          Validators.required,
          // Validators.pattern('[a-zA-Z-]'),
        ]),

        pwd: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ]),
        cpwd: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ]),
        gender: new FormControl('', [Validators.required]),
        birthday: new FormControl('', [Validators.required]),
        mobile: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
      },
      { validators: this.identityRevealedValidator }
    );
  }
  identityRevealedValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const pwd = control.get('pwd');
    const cpwd = control.get('cpwd');
    return pwd && cpwd && pwd.value !== cpwd.value
      ? { identityRevealed: true }
      : null;
  };
  getToday(): string {
    return new Date().toISOString().split('T')[0];
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
  Mustmatch(pwd: any, cpwd: any) {
    debugger;
    return () => {
      debugger;
      const passwordcontrol = this.registrationForm.controls[pwd];
      const confirmpasswordcontrol = this.registrationForm.controls[cpwd];
      if (
        confirmpasswordcontrol.errors &&
        !confirmpasswordcontrol.errors['Mustmatch']
      ) {
        return;
      }
      if (passwordcontrol.value !== confirmpasswordcontrol.value) {
        confirmpasswordcontrol.setErrors({ Mustmatch: true });
      } else {
        confirmpasswordcontrol.setErrors(null);
      }
    };
  }

  get FullName(): FormControl {
    return this.registrationForm.get('fullname') as FormControl;
  }
  get Pwd(): FormControl {
    return this.registrationForm.get('pwd') as FormControl;
  }
  get Cpwd(): FormControl {
    return this.registrationForm.get('cpwd') as FormControl;
  }
  get Gender(): FormControl {
    return this.registrationForm.get('gender') as FormControl;
  }
  get Birthday(): FormControl {
    return this.registrationForm.get('birthday') as FormControl;
  }
  get Mobile(): FormControl {
    return this.registrationForm.get('mobile') as FormControl;
  }
  get Email(): FormControl {
    return this.registrationForm.get('email') as FormControl;
  }
}
