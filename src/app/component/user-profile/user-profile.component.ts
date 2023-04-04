import { Component } from '@angular/core';
import { Observable, ReplaySubject, distinctUntilChanged, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { autenticationState } from '@app/store/autentication/autentication.state';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  avatarName!:string;
  registerUser: any[] = [];
  loggedInUser$: Observable<any> | undefined;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();
  userData:any;
  details:any[]=[];
  
  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    private store: Store<autenticationState>
  ) {}

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
        this.userData = state?.userData;
        this.avatarName = this.getUserLetter(this.userData?.fullName);
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
}
