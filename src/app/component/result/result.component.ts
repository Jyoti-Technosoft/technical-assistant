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
import { ToastService } from '@app/toast.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit, OnDestroy {
  loggedInUser$: Observable<any> | undefined;
  userData: any;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    private store: Store<any>,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getLoggedUser();
    this.resultData();
  }

  resultData() {
    this.store
      .select((state: any) => state.quiz.latestQuizResult)
      .pipe(distinctUntilChanged(),takeUntil(this.destroyer$))
      .subscribe((data) => {
        this.userData = data;
      });
    if (!this.userData) {
      this.router.navigateByUrl('dashbaord');
      this.toastService.showErrorMessage('No Quiz Played Yet')
    }
  }

  startQuizAgain(quizName: string) {
    const queryParams: Params = { quiz: quizName };
    this.router.navigate(['/quizname'], { queryParams });
  }

  showAllQuiz() {
    this.router.navigateByUrl('/allresults');
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
