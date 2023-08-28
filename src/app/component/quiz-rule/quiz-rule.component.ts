import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { QuizDataService } from '@app/service/quiz-data.service';
import { ToastService } from '@app/toast.service';
import { Subscription } from 'rxjs';
import { LOCALSTORAGE_KEY } from '@app/utility/utility';

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

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private auth: AuthenticationService,
    private quizservice: QuizDataService,
    private toastService: ToastService,
    private cd: ChangeDetectorRef
  ) {

    this.sub = new Subscription();
    this.selectedQuiz = this.activeRoute.snapshot.queryParams['quiz'];
    this.auth.authStatusListener$.next(true);
   }

  ngOnInit(): void {

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
        this.toastService.show('error', 'Error! While fetching information.');
      }
    });
    this.sub.add(quizData);
  }

  applyRulesForTest(data: string): void {

    data = data.replace('timer', this.instruction.timer);
    data = data.replace('positivePoints', this.instruction.positivePoints);
    data = data.replace('negativePoints', this.instruction.negativePoints);
    data = data.replace('numberOfQuestions', this.instruction.numberOfQuestions);
    this.displayRules = data;
  }

  allQuiz(): void {

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
