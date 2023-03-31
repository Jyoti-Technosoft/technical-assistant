import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

import { AuthenticationService } from '@app/service/authentication.service';
import {
  distinctUntilChanged,
  Observable,
  ReplaySubject,
  takeUntil,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { autenticationState } from '@app/store/autentication/autentication.state';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit, OnDestroy {
  allResultData: any;
  loggedInUser$: Observable<any> | undefined;
  userData: any;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    private store: Store<autenticationState>
  ) {}

  ngOnInit(): void {
    this.getLoggedUser();
    this.resultData();
  }

  resultData() {
    let data: any = localStorage.getItem('result');
    this.allResultData = JSON.parse(data).filter((data: any) => {
      return data?.user == this.userData.id;
    });
    const sorter = (a: any, b: any) => {
      return new Date(a.date) > new Date(b.date) ? a : b;
    };
    this.allResultData = this.allResultData?.reduce(sorter);
  }

  startQuizAgain(quizName: string) {
    const queryParams: Params = { quiz: quizName };
    this.router.navigate(['/quizname'], { queryParams });
  }

  showAllQuiz() {
    const queryParams: Params = { result: 'allresults' };
    this.router.navigate(['/allresults'], { queryParams });
  }

  getLoggedUser() {
    this.loggedInUser$ = this.store.select(
      (state: any) => state.authentication
    );
    this.loggedInUser$
      .pipe(takeUntil(this.destroyer$), distinctUntilChanged())
      .subscribe((state) => {
        this.userData = state?.userData;
      });
  }

  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
