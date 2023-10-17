import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { Subscription } from 'rxjs';
import { LOCALSTORAGE_KEY } from '@app/utility/utility';
import quizData from '@assets/json/quizDetails.json';
@Component({
  selector: 'app-quiz-rule',
  templateUrl: './quiz-rule.component.html',
  styleUrls: ['./quiz-rule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizRuleComponent implements OnInit, OnDestroy{

  allQuizData = [...quizData];
  instruction: any;
  selectedQuizType = '';
  selectedQuiz = '';
  sub: Subscription;
  displayRules!: string;
  isMobileView = false;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef
  ) {

    this.sub = new Subscription();
    this.selectedQuiz = this.activeRoute.snapshot.queryParams['quiz'];
   }

  ngOnInit(): void {

    this.auth.getScreenSize().subscribe(v => {
      this.isMobileView = v;
      this.cd.detectChanges();
    });
    this.instruction = this.allQuizData?.filter((v:any) => v?.id === this.selectedQuiz)[0];
    this.getInstructions(this.instruction);
  }

  getInstructions(quizInfo: any): void {

    this.applyRulesForTest(quizInfo.rules);
    localStorage.setItem(LOCALSTORAGE_KEY.QUIZ_DETAILS, JSON.stringify(this.instruction));
    this.cd.detectChanges();
  }

  applyRulesForTest(data: string): void {

    data = data?.replaceAll('timer', this.instruction.timer);
    data = data?.replace('positivePoints', this.instruction.positivePoints);
    data = data?.replace('negativePoints', this.instruction.negativePoints);
    data = data?.replace('numberOfQuestions', this.instruction.numberOfQuestions);
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
