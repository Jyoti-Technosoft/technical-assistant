import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  ValidationErrors,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit {
  @Input() public configData: any;

  userData: any;
  registrationForm!: FormGroup;
  registerUser: any[] = [];

  constructor(public fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit() {
    console.log(this.configData?.userData);
    if (this.configData?.userData) {
      this.createForm(this.configData?.userData);
    }
  }

  submitform(formValue: any) {
    let data = JSON.parse(localStorage.getItem('registerUser') as string);
    const updatedData = data?.map((value: any) => {
      if (value?.id == formValue?.id) {
        data = formValue;
      }
      return data;
    });
    localStorage.setItem('registerUser', JSON.stringify(updatedData));
  }

  validateNumber: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[123456789]\d{9}$/;
    return regex.test(control.value) ? null : { pattern: true };
  };

  createForm(userData: any) {
    this.registrationForm = this.fb.group({
      id: [userData?.id],
      fullName: [userData?.fullName, [Validators.required]],
      email: [
        userData?.email,
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        userData?.password,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}$'
          ),
        ]),
      ],
      dateOfBirth: [
        userData?.dateOfBirth,
        Validators.compose([Validators.required]),
      ],
      mobile: [
        userData?.mobile,
        Validators.compose([Validators.required, this.validateNumber]),
      ],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  get registrationFormValidator() {
    return this.registrationForm.controls;
  }
}
