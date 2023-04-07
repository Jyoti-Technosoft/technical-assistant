import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { DialogService } from '@app/dialog-service/dialog.service';
import dialogData from '@assets/json/dialogData.json';
import { AuthenticationService } from '@app/service/authentication.service';
import {
  autenticationState,
  getStateSelector,
} from '@app/store/autentication/autentication.state';
import { doLogout } from '@app/store/autentication/autentication.action';
import {
  distinctUntilChanged,
  Observable,
  ReplaySubject,
  takeUntil,
} from 'rxjs';
import { OnDestroy } from '@angular/core';

interface menuItem { label:string, icon: string, link?:string }

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  dialogData = { ...dialogData };
  userData: any;
  loggedInUser$: Observable<any> | undefined;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  menuItem: menuItem[] = [
    { label: 'Dashboard', icon: 'fa-home', link: 'dashboard' },
    { label: 'All Results', icon: 'fa-th-large', link: 'allresults' },
    { label: 'Profile', icon: 'fa-user', link: 'Profile' },
    { label: 'Sign Out', icon: 'fa-sign-out' }
  ]

  constructor(
    public authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private store: Store<autenticationState>
  ) {}
  
  ngOnInit() {
    this.getUserData();
  }
  
  openAboutDialog() {
    let configData = this.dialogData.aboutModel;
    this.dialogService.openDialog(configData);
  }
  
  getUserData() {
    this.loggedInUser$ = this.store.select(
      (state: any) => state.authentication
      );
      this.loggedInUser$
      .pipe(takeUntil(this.destroyer$), distinctUntilChanged())
      .subscribe((state) => {
        this.userData = state?.userData;
      });
    }
    
  openSignOutDialog() {
    let configData = this.dialogData.signoutModel;
    this.dialogService.openDialog(configData).then((value) => {
      if (value) {
        this.store.dispatch(doLogout());
      }
    });
  }
  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
