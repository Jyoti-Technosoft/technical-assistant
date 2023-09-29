import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { PATTERN } from '@app/utility/utility';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { SnackbarService } from '@app/service/snackbar.service';
import dialogData from '@assets/json/dialogData.json';
import { DialogService } from '@app/dialog-service/dialog.service';

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
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserProfileComponent implements OnInit {

  avatarName!: string;
  userData: any;
  profilePageForm!: FormGroup;
  changePasswordForm!: FormGroup;
  editMode = false;
  showPasswordChange = false;
  subs: Subscription;
  isMobileView = false;
  userId: number;
  dialogData = { ...dialogData };
  hidePassword = true;
  hideNewPassword = true;
  hideconfirmPassword = true;

  passwordMess = '';

  constructor(
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef,
    public router: Router,
    private snackBarService: SnackbarService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public calendar: NgbCalendar
  ) {

    this.subs = new Subscription();
    this.userId = auth.getUserId();
  }

  ngOnInit(): void {

    this.auth.getScreenSize().subscribe(v => {
      this.isMobileView = v;
      this.cd?.detectChanges();
    });
    this.getUserData(this.userId);
  }

  getUserData(id: number): void {

    const userData = this.auth.getUserDetail(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.userData = res.data;
          this.avatarName = this.getUserLetter(this.userData?.name);
          this.createForm(this.userData);
          this.createChangePasswordForm();
          this.cd?.detectChanges();
        } else {
          this.snackBarService.error(res.message);
        }
      },
      error: (err) => {
        this.snackBarService.error(err.message);
      }
    });

    this.subs.add(userData);
  }

  getUserLetter(userName: any) {

    const intials = userName
      .split(' ')
      .map((name: any) => name[0])
      .join('')
      .toUpperCase();
    return intials;
  }

  createForm(data?:any) {

    this.profilePageForm = this.fb.group({
      email: [data?.email || '', [Validators.required, Validators.pattern(PATTERN.EMAIL_PATTERN)]],
      name: [data?.name || '', [Validators.required, Validators.pattern(PATTERN.FULL_NAME_PATTERN)]],
      gender: [data?.gender || '', Validators.required],
      birth_date: [new Date(data?.birth_date) || '', Validators.required],
      contact: [data?.contact || '', [Validators.required, Validators.pattern(PATTERN.MOBILE_PATTERN)]]
    });
  }

  createChangePasswordForm(): void {

    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(PATTERN.PASSWORD_PATTERN)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(PATTERN.PASSWORD_PATTERN)]],
    });

    this.changePasswordForm.get('confirmPassword')?.setValidators(this.confirmPasswordMatchValidator.bind(this));
  }

  confirmPasswordMatchValidator(control: AbstractControl): ValidationErrors | null {

    let newPass = this.changePasswordForm.get('newPassword')?.value;
    let password = control.value;
    return password ===  newPass ? null : { passwordMismatch: true };
  }

  updatePassword(): void {

    if (this.changePasswordForm.valid) {

      let configData = this.dialogData?.changePasswordModel;
      this.dialogService?.openDialog(configData).then((value) => {
        if (value) {
          let data = this.changePasswordForm.getRawValue();
          const passData = {
            'userId': this.userId,
            'old_password': data.password,
            'new_password': data.newPassword
          };

          const userData = this.auth.changePassword(passData).subscribe({
            next: (res) => {
              if (res.success) {
                this.snackBarService.success(res.message);
                this.editMode = false;
                this.router.navigateByUrl('login');
                this.cd.detectChanges();
              } else {
                this.snackBarService.error(res.message);
              }
            },
            error: (err) => {
              this.snackBarService.error(err.message);
            }
          });
          this.subs.add(userData);
        }
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  onHideShowPasswordForm() {

    this.showPasswordChange = !this.showPasswordChange;
  }

  updateUserDetails() {

    if (this.profilePageForm.valid) {
      let configData = this.dialogData?.updateProfileModel;
      this.dialogService?.openDialog(configData).then((value) => {
        if (value) {
          let data = this.profilePageForm.getRawValue();
          const userData = this.auth.updateUserData(data, this.userId).subscribe({
            next: (res) => {
              if (res.success) {
                this.snackBarService.success(res.message);
                this.editMode = false;
                this.getUserData(this.userId);
                this.cd.detectChanges();
              } else {
                this.snackBarService.error(res.message);
              }
            },
            error: (err) => {
              this.snackBarService.error(err.message);
            }
          });
          this.subs.add(userData);
        }
      });
    } else {
      this.profilePageForm.markAllAsTouched();
    }
  }

  cancelUpdate() {
    this.showPasswordChange = false;
    this.editMode = false;
    this.cd.detectChanges();
  }

  editUserdetails() {
    this.editMode = true;
    this.cd.detectChanges();
  }

  getControl(form: FormGroup, field: string) {
    return form.get(field);
  }
}
