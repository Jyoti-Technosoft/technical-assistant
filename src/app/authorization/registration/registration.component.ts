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
import { ToastService } from 'src/app/toast.service';

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
  todayDate : string | undefined = new Date().toISOString().slice(0, 10);
  @ViewChild('email') email!: ElementRef;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getRegistredUser();
  }

// Toast mesaage
showMessage(){
  this.toastService.show('User Registered Successfully!', { classname:'bg-success text-light', delay:10000 });
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
      let label = this.dialogData.emailModal.label;
      let yesButtonLable = this.dialogData.emailModal.yesButtonLable;
      let NoButtonLable = this.dialogData.emailModal.NoButtonLable;
      this.dialogService
        .openDialog(label, yesButtonLable, NoButtonLable)
        .then((value) => {
          if (value) {
            this.route.navigateByUrl('login');
          }
          else{
            setTimeout(() => {
              this.email.nativeElement.focus();
            });
          }
        });
    } 
    else {
      this.registeruser.push(formValue);
      localStorage.setItem('registeruser', JSON.stringify(this.registeruser));
      this.route.navigateByUrl('login');
    }
    
  }

  passwordNotMatched: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const pwd = this.registrationForm?.controls['pwd'];
    return pwd?.value !== control?.value
      ? {passwordNotMatched: true }
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
        Validators.compose([Validators.required, this.passwordNotMatched]),
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
