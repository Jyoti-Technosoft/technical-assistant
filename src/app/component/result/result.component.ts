import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { RESULT_QUIZ, TOAST_BG_COLOR } from '@app/shared/toast.enum';
import { ToastService } from '@app/toast.service';
import { Subscription } from 'rxjs';
import { LOCALSTORAGE_KEY } from '@app/utility/utility';

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
    private toastService: ToastService,
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
      this.router.navigateByUrl('dashbaord');
      this.toastService.toastMessage(RESULT_QUIZ, TOAST_BG_COLOR.TOAST_ERROR_COLOR);
    }
  }

  startQuizAgain(quizName: string): void {

    const queryParams: Params = { quiz: quizName };
    this.router.navigate(['/rules'], { queryParams });
  }

  showAllQuiz(): void {

    this.router.navigateByUrl('allresults');
  }

  ngOnDestroy(): void {

    this.sub.unsubscribe();
  }
}
