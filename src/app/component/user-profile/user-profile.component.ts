import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  Observable,
  ReplaySubject,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { autenticationState } from '@app/store/autentication/autentication.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { updateUserDetails } from '@app/store/autentication/autentication.action';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  avatarName!: string;
  loggedInUser$: Observable<any> | undefined;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();
  userData: any;
  profilePageForm!: FormGroup;
  editMode!: boolean;

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    private store: Store<autenticationState>,
    private fb: FormBuilder
  ) {}
  ngAfterViewInit(): void {
    this.profilePageForm.disable();
  }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.loggedInUser$ = this.store.select(
      (state: any) => state.authentication
    );
    this.loggedInUser$
      .pipe(takeUntil(this.destroyer$), distinctUntilChanged())
      .subscribe((state) => {
        this.initForm(state?.userData);
        this.userData = state?.userData;
        this.avatarName = this.getUserLetter(state?.userData?.fullName);
      });
  }

  

  initForm(data?:any) {
    this.profilePageForm = this.fb.group({
      dateOfBirth: [data?.dateOfBirth || '',Validators.compose([Validators.required])],
      email: [data?.email || '',Validators.compose([Validators.required, Validators.email])],
      fullName: [data?.fullName || '',Validators.compose([Validators.required])],
      gender: [data?.gender || '',Validators.compose([Validators.required])],
      id: [data?.id || ''],
      mobile: [data?.mobile || '',Validators.compose([Validators.required])],
    });
  }
  getUserLetter(userName: string) {
    const intials = userName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
    return intials;
  }

  updateUserDetails() {
    this.store.dispatch(updateUserDetails(this.profilePageForm?.value));
  }
  cancelUpdate() {
    this.profilePageForm.disable();
  }

  editUserdetails() {
    this.profilePageForm.enable();
  }

  get profilePageFormController() {
    return this.profilePageForm.controls;
  }
}
