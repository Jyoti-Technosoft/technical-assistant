import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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
import { RESULT_QUIZ, TOAST_BG_COLOR } from '@app/shared/toast.enum';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResultComponent implements OnInit, OnDestroy {
  loggedInUser$: Observable<any> | undefined;
  userData: any;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();
  recentResult: any;
  percentage: any;
  incorrectanswer: any;

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
      .pipe(distinctUntilChanged(), takeUntil(this.destroyer$))
      .subscribe((data) => {
        this.recentResult = data;
      });

    if (!this.recentResult) {
      this.router.navigateByUrl('dashbaord');
      this.toastService.toastMessage(
        RESULT_QUIZ,
        TOAST_BG_COLOR.TOAST_ERROR_COLOR
      );
    }
    this.percentage = (
      (this.recentResult?.points / this.recentResult?.totalPoints) *
      100
    ).toFixed(2);
    this.incorrectanswer = (100 - this.percentage).toFixed(2);
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
