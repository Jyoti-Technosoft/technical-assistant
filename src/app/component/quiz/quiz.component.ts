import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription, ReplaySubject, takeUntil } from 'rxjs';

import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import quizData from 'src/assets/json/data.json';
import dialogData from 'src/assets/json/dialogData.json';
import { DialogService } from 'src/app/dialog-service/dialog.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
@Component({
  selector: 'app-questions',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class Quizcomponent implements OnInit, OnDestroy {
  quizData = { ...quizData };
  @ViewChild('carousel')
  carousel!: NgbCarousel;
  quizForm!: FormGroup;
  question!: any;
  options!: any[];
  title!: any;
  dialogData = { ...dialogData };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  questionIndex: number = 0;
  interval$!: Subscription;
  points: number = 0;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  timer: number | undefined;
  selectedQuizType!: string;
  positivePoints!: number;
  negativePoints!: number;
  numberOfQuestions!: string | undefined;

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService
  ) {
    this.quizForm = this.fb.group({
      form: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.selectedQuizType = this.activeRouter.snapshot.queryParams['quiz'];
    this.startCounter();
    this.getQuestionData();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    let result;
    if (result) {
    }
    event.returnValue = false;
  }

  getQuestionData() {
    const quizData:any = this.quizData.quiz.find(
      (data) => data.quizId == this.selectedQuizType
    );
    this.question = [...quizData.questions];
    this.question = this.question?.sort(() => Math.random() - 0.67).splice(0, quizData.numberOfQuestions);
    this.options = this.question.map((question: any) =>
      question.options.sort(() => Math.random() - 0.69)
    );
    this.timer = quizData?.timer;
    this.positivePoints = quizData?.positivePoints;
    this.negativePoints = quizData.negativePoints;

    const formArray = this.quizForm.controls['form'] as FormArray;
    this.question.forEach((item: any) => {
      formArray.push(
        this.fb.group({
          radioValue: '',
          timer: this.timer,
        })
      );
    });
  }

  get formArray() {
    return this.quizForm.controls['form'] as FormArray;
  }

  nextQuestion(questionIndex: number) {
    this.carousel.next();
    if (this.dialogService.hasModelOpen()) {
      this.dialogService.destroy();
    }
    this.answer(questionIndex, this.formArray.controls[questionIndex].value.radioValue);
    this.disabledValuesAndForm();
    this.questionIndex = questionIndex + 1;
    if (this.questionIndex == this.question.length) {
      this.submitQuiz();
    }
  }

  previousQuestion(questionIndex: number) {
    this.questionIndex = questionIndex - 1;
    this.carousel?.prev();
  }

  submitQuiz() {
    let data: any = localStorage.getItem('result')
      ? localStorage.getItem('result')
      : [];
    let stringifyData = data.length == 0 ? data : JSON.parse(data);
    let currentData = {
      points: this.points,
      correctAnswer: this.correctAnswer,
      inCorrectAnswer: this.inCorrectAnswer,
      type: this.selectedQuizType,
      user: this.authenticationService.getUser(),
      date: new Date().toISOString().slice(0, 10)
    };
    stringifyData.push(currentData);

    localStorage.setItem('result', JSON.stringify(stringifyData));
    this.router.navigateByUrl('result');
  }

  skipQuestion(questionindex: number) {
    let configData = this.dialogData.skipModel;
    this.dialogService
      .openDialog(configData)
      .then((value) => {
        if (value) {
          this.questionIndex = questionindex;
          this.nextQuestion(this.questionIndex);
        }
      });
  }

  disabledValuesAndForm() {
    this.formArray.controls
      .at(this.questionIndex)
      ?.get('radioValue')
      ?.disable();
    this.formArray.controls.at(this.questionIndex)?.get('timer')?.disable();
    this.formArray.controls.at(this.questionIndex)?.markAsDirty();
  }

  startCounter() {
    this.interval$ = interval(1000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((val) => {
        const counterValue = this.formArray.controls.at(this.questionIndex)
          ?.value.timer;
        if (
          Number(counterValue) != 0 &&
          !this.formArray.controls.at(this.questionIndex)?.get('timer')
            ?.disabled
        ) {
          this.formArray.controls
            .at(this.questionIndex)
            ?.patchValue({ timer: counterValue - 1 });
        } else if (
          Number(counterValue) === 0 &&
          !this.formArray.controls.at(this.questionIndex)?.get('timer')
            ?.disabled
        ) {
          this.nextQuestion(this.questionIndex);
        }
      });
  }

  answer(questionIndex: number, selectedOption: string) {
    if (!this.formArray.at(questionIndex).get('timer')?.disabled) {
      if (this.question[questionIndex].answer?.id == selectedOption) {
        this.points = this.points += this.positivePoints;
        this.correctAnswer++;
      } else if (!(this.question[questionIndex].answer?.id == selectedOption)) {
        this.points = this.points -= this.negativePoints;
        this.inCorrectAnswer++;
      }
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
