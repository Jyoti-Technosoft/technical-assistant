import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/service/authentication.service';
import { DashboardService } from '@app/service/dashboard.service';
import { QuizDataService } from '@app/service/quiz-data.service';
import { Params, Router } from '@angular/router';
import { SnackbarService } from '@app/service/snackbar.service';
import quizData from '@assets/json/quizDetails.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {

  quizInformationdata = [...quizData];
  cardData = 8;
  sub: Subscription;
  quizCountData: any;
  userId!: number;
  isMobileView = false;

  constructor(
    private auth: AuthenticationService,
    private quizservice: QuizDataService,
    private dashboard: DashboardService,
    private route: Router,
    private snackbarService: SnackbarService,
    private cd: ChangeDetectorRef
  ) {
    this.sub = new Subscription();
    this.userId = auth.getUserId();
  }

  ngOnInit(): void {

    this.auth.getScreenSize().subscribe(v => {
      this.isMobileView = v;
      this.cd.detectChanges();
    });

    this.getUserCountData();
    this.getQuizData();
  }

  getUserCountData(): void {

    const countData = this.dashboard.getAllCountData(this.userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.quizCountData = res.data;
          this.cd.detectChanges();
        } else {
          this.snackbarService.error(res.message);
        }
      },
      error: (err) => {
        this.snackbarService.error(err.message);
      }
    });
    this.sub.add(countData);
  }

  getQuizData(): void {

    const quizData = this.quizservice.getQuizName().subscribe({
      next: (res) => {
        if (res.success) {
          this.addOtherQuizDetails(res.data);
          this.cd.detectChanges();
        } else {
          this.snackbarService.error(res.message);
        }
      },
      error: (err) => {
        this.snackbarService.error(err.message);
      }
    });
    this.sub.add(quizData);
  }

  maxPlayed(title: any): string {

    let sub;
    if (title.length > 1) {
      sub = title?.join(', ');
    } else {
      sub = title[0];
    }
    return sub;
  }

  addOtherQuizDetails(data: any): void {

    let ids = data.filter((v:any) => v.id);
    this.quizInformationdata.filter((q:any) => {
      if (ids.includes(q.id)) {
        return q;
      }
    });
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
