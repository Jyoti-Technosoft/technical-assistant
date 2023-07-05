import { Component, OnDestroy, OnInit } from '@angular/core';
import { autenticationState } from '@app/store/autentication/autentication.state';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  Observable,
  ReplaySubject,
  takeUntil,
} from 'rxjs';
interface menuItem {
  label: string;
  icon: string;
  link?: string;
}

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss'],
})
export class FullLayoutComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  loggedInUser$: Observable<any> | undefined;
  menuItem: menuItem[] = [
    { label: 'Dashboard', icon: 'fa-home', link: 'dashboard' },
    { label: 'All Results', icon: 'fa-th-large', link: 'allresults' },
    { label: 'Profile', icon: 'fa-user', link: 'Profile' },
    { label: 'Sign Out', icon: 'fa-sign-out' },
  ];
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(private store: Store<autenticationState>) {}
  
  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.loggedInUser$ = this.store.select(
      (state: any) => state.authentication
    );
    this.loggedInUser$
      .pipe(takeUntil(this.destroyer$), distinctUntilChanged())
      .subscribe((data: any) => {
        this.isLoggedIn = data?.isUserLoggedIn;
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
