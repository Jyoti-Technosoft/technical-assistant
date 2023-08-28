import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/service/authentication.service';
import { DashboardService } from '@app/service/dashboard.service';
import { QuizDataService } from '@app/service/quiz-data.service';
import { Params, Router } from '@angular/router';
import { ToastService } from '@app/toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {

  quizs: any[] = [];
  cardData = 8;
  sub: Subscription;
  quizCountData: any;
  userToken!: boolean;

  constructor(
    private auth: AuthenticationService,
    private quizservice: QuizDataService,
    private dashboard: DashboardService,
    private route: Router,
    private toastService: ToastService,
    private cd: ChangeDetectorRef
  ) {
    this.sub = new Subscription();
  }

  ngOnInit(): void {

    this.auth.authStatusListener$.next(true);
    this.getUserCountData();
    this.getQuizData();
  }

  getUserCountData(): void {

    const countData = this.dashboard.getAllCountData().subscribe({
      next: (res) => {
        if (!!res) {
          this.quizCountData = res[0];
          this.cd.detectChanges();
        }
      },
      error: () => {
        this.toastService.show('error', 'Error! while fetching quiz count data');
      }
    });
    this.sub.add(countData);
  }

  getQuizData(): void {

    const quizData = this.quizservice.getQuizDetails().subscribe({
      next: (res) => {
        if (!!res) {
          this.quizs = res;
          console.log('quizs', this.quizs);
          this.cd.detectChanges();
        }
      },
      error: () => {
        this.toastService.show('error', 'Error! while fetching quiz details');
      }
    });
    this.sub.add(quizData);
  }

  startQuiz(title: string) {

    const queryParams: Params = { quiz: title };
    this.route.navigate(['/rules'], { queryParams });
  }

  loadMore() {

    this.cardData = this.cardData + 8;
  }

  ngOnDestroy(): void {

    this.sub.unsubscribe();
  }
}
