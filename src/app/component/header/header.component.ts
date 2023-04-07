import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnDestroy } from '@angular/core';
import {
  distinctUntilChanged,
  Observable,
  ReplaySubject,
  takeUntil,
} from 'rxjs';

import { DialogService } from '@app/dialog-service/dialog.service';
import { AuthenticationService } from '@app/service/authentication.service';
import {
  autenticationState,
  getStateSelector,
} from '@app/store/autentication/autentication.state';
import { doLogout } from '@app/store/autentication/autentication.action';

import dialogData from '@assets/json/dialogData.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  dialogData = { ...dialogData };
  userData: any;
  loggedInUser$: Observable<any> | undefined;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

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
