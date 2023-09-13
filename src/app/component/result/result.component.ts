import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { Subscription } from 'rxjs';
import { LOCALSTORAGE_KEY, MESSAGE } from '@app/utility/utility';
import { SnackbarService } from '@app/service/snackbar.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ResultComponent implements OnInit, OnDestroy {

  userData: any;
  sub: Subscription;
  recentResult: any;
  isMobileView = false;

  constructor (
    public auth: AuthenticationService,
    public router: Router,
    private snackBarService: SnackbarService,
    private cd: ChangeDetectorRef
  ) {
    this.sub = new Subscription();
    this.auth.authStatusListener$.next(true);
    this.recentResult = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY.LAST_RESULT_DATA) as string);
  }

  ngOnInit(): void {

    this.auth.getScreenSize().subscribe(v => {
      this.isMobileView = v;
      this.cd.detectChanges();
    });

    if (!this.recentResult) {
      this.router.navigateByUrl('dashboard');
      this.snackBarService.error(MESSAGE.NO_QUIZ);
    }
  }

  startQuizAgain(quizName: string): void {

    const queryParams: Params = { quiz: quizName };
    this.router.navigate(['/rules'], { queryParams });
  }

  showAllQuiz(): void {

    this.router.navigateByUrl('results');
  }

  goToList(): void {
    this.router.navigateByUrl('dashboard');
  }

  ngOnDestroy(): void {

    localStorage.removeItem(LOCALSTORAGE_KEY.LAST_RESULT_DATA);
    localStorage.removeItem(LOCALSTORAGE_KEY.QUIZ_DETAILS);
    this.sub.unsubscribe();
  }
}
