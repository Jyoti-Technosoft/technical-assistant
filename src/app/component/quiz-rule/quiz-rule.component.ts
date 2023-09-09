import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { QuizDataService } from '@app/service/quiz-data.service';
import { Subscription } from 'rxjs';
import { LOCALSTORAGE_KEY, MESSAGE } from '@app/utility/utility';
import { SnackbarService } from '@app/service/snackbar.service';

@Component({
  selector: 'app-quiz-rule',
  templateUrl: './quiz-rule.component.html',
  styleUrls: ['./quiz-rule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizRuleComponent implements OnInit, OnDestroy{

  instruction:any = {};
  selectedQuizType = '';
  selectedQuiz = '';
  sub: Subscription;
  displayRules!: string;
  isMobileView = false;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private auth: AuthenticationService,
    private quizservice: QuizDataService,
    private snackBarService: SnackbarService,
    private cd: ChangeDetectorRef
  ) {

    this.sub = new Subscription();
    this.selectedQuiz = this.activeRoute.snapshot.queryParams['quiz'];
    this.auth.authStatusListener$.next(true);
   }

  ngOnInit(): void {

    this.auth.getScreenSize().subscribe(v => {
      this.isMobileView = v;
      this.cd.detectChanges();
    });
    this.getInstructions();
  }

  getInstructions(): void {

    const quizData = this.quizservice.getSingleQuizDetails(this.selectedQuiz).subscribe({
      next: (res) => {
        if (!!res) {
          this.instruction = res;
          this.applyRulesForTest(this.instruction.rules);
          localStorage.setItem(LOCALSTORAGE_KEY.QUIZ_DETAILS, JSON.stringify(this.instruction));
          this.cd.detectChanges();
        }
      },
      error: () => {
        this.snackBarService.error(MESSAGE.SOMTHING);
      }
    });
    this.sub.add(quizData);
  }

  applyRulesForTest(data: string): void {

    data = data.replaceAll('timer', this.instruction.timer);
    data = data.replace('positivePoints', this.instruction.positivePoints);
    data = data.replace('negativePoints', this.instruction.negativePoints);
    data = data.replace('numberOfQuestions', this.instruction.numberOfQuestions);
    this.displayRules = data;
  }

  allQuiz(): void {

    localStorage.removeItem(LOCALSTORAGE_KEY.QUIZ_DETAILS);
    this.route.navigateByUrl('dashboard');
  }

  quiz(): void {

    const queryParams: Params = { quiz: this.selectedQuiz };
    this.route.navigate(['/quiz'], { queryParams });
  }

  ngOnDestroy(): void {

    this.sub.unsubscribe();
  }
}
