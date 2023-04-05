import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from "@angular/core";
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

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  dialogData = { ...dialogData };
  userData: any;
  @ViewChild('rowExpand') rowExpand!: ElementRef<any> ;
  isRowExpand!: boolean;
  loggedInUser$: Observable<any> | undefined;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    public authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private elemenRef : Renderer2,
    private store: Store<autenticationState>
  ) {}
  
  ngOnInit() {
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
      });
  }
  
  openAboutDialog() {
    let configData = this.dialogData.aboutModel;
    this.dialogService.openDialog(configData);
  }

  expandRow() {
    if(this.isRowExpand) {
      this.isRowExpand = false;
      this.elemenRef.removeClass(this.rowExpand, 'in');
    } else {
      this.isRowExpand = true;
      this.elemenRef.addClass(this.rowExpand, 'in');
    } 
  }

  getUserLetter(userName: string) {
    const intials = userName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
    return intials;
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
