import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { interval, Observable, ReplaySubject, Subscription, takeUntil } from 'rxjs';
import { QuestionService } from '../../service/question.service';
import quizData from '../../../assets/json/data.json';
import dialogData from '../../../assets/json/dialogData.json';
import { DialogService } from 'src/app/dialog-service/dialog.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-questions',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class Quizcomponent implements OnInit, OnDestroy {
  quizData = { ...quizData };
  @ViewChild('carousel')
  carousel!: NgbCarousel;
  myForm!: FormGroup;
  question!: any;
  dialogData = { ...dialogData };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  questionIndex:number = 0;
  interval$!: Subscription;
  points: number = 0;
  correctanswer: number = 0;
  inCorrectanswer: number = 0;
  filterquestionsindex!: number;
  timer!: any;
  selectedQuizType: any;
  radioValue!: string;
  options: string | number | undefined;
  positivePoints: any;
  negativePoints: any;
  numberOfQuestions!: string | undefined;
  

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private fb: FormBuilder,
    private quizService: QuestionService,
    private questionService: QuestionService,
    private dialogService: DialogService
  ) {
    this.myForm = this.fb.group({
      form: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.filterquestionsindex = this.questionIndex;
    this.startCounter();
    this.selectedQuizType = this.activeRouter.snapshot.queryParams['quiz'];

    this.mapJSONData();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    let result;
    if (result) {
      // Do more processing...
    }
    event.returnValue = false; // stay on same page
  }

  mapJSONData() {
    this.numberOfQuestions = this.quizData.quiz.find(
      (data) => data.quizId == this.selectedQuizType
    )?.numberOfQuestions;
    let data: any = this.quizData.quiz.find(
      (data) => data.quizId == this.selectedQuizType
    )?.questions;
    this.question = [...data];
    this.question = this.question?.sort(() => Math.random() - 0.67);
    this.question = [...this.question?.splice(0, this.numberOfQuestions)];
    this.options = this.question.map((question: any) =>
      question.options.sort(() => Math.random() - 0.69)
    );
    this.timer = this.quizData?.quiz?.find(
      (data) => data?.quizId == this.selectedQuizType
    )?.timer;
    this.positivePoints = this.quizData.quiz.find(
      (data) => data.quizId == this.selectedQuizType
    )?.positivePoints;
    this.negativePoints = this.quizData.quiz.find(
      (data) => data.quizId == this.selectedQuizType
    )?.negativePoints;

    const formArray = this.myForm.controls['form'] as FormArray;
    this.question.forEach((item: any) => {
      formArray.push(
        this.fb.group({
          radioValue: '',
          timer: this.timer,
        })
      );
    });
  }

  get FormArray() {
    return this.myForm.controls['form'] as FormArray;
  }

  nextQuestion(questionIndex: number): void {
    this.carousel.next();
    const values = this.FormArray.controls[questionIndex].value.radioValue;
    this.answer(questionIndex, values);
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
      correctanswer: this.correctanswer,
      inCorrectAnswer: this.inCorrectanswer,
      type: this.selectedQuizType,
      user: this.questionService.getUser(),
      date: new Date().toISOString().slice(0, 10)
    };
    stringifyData.push(currentData);

    localStorage.setItem('result', JSON.stringify(stringifyData));
    this.questionService.points = this.points;
    this.questionService.correctanswer = this.correctanswer;
    this.questionService.inCorrectAnswer = this.inCorrectanswer;
    this.router.navigate(['/result']);
  }

  skipQuestion(questionIndex: number) {
    let label = this.dialogData.skipModel.label;
    let yesButtonLable = this.dialogData.skipModel.yesButtonLable;
    let NoButtonLable = this.dialogData.skipModel.NoButtonLable;
    this.dialogService
      .openDialog(label, yesButtonLable, NoButtonLable)
      .then((value) => {
        if (value) {
          this.questionIndex = questionIndex;
          this.nextQuestion(this.questionIndex);
        }
      });
  }

  disabledValuesAndForm() {
    this.FormArray.controls
      .at(this.questionIndex)
      ?.get('radioValue')
      ?.disable();
    this.FormArray.controls.at(this.questionIndex)?.get('timer')?.disable();
    this.FormArray.controls.at(this.questionIndex)?.markAsDirty();
  }

  startCounter() {
    this.interval$ = interval(1000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((val) => {
        const counterValue = this.FormArray.controls.at(this.questionIndex)
          ?.value.timer;
        if (
          Number(counterValue) != 0 &&
          !this.FormArray.controls.at(this.questionIndex)?.get('timer')
            ?.disabled
        ) {
          this.FormArray.controls
            .at(this.questionIndex)
            ?.patchValue({ timer: counterValue - 1 });
        } else if (
          Number(counterValue) === 0 &&
          !this.FormArray.controls.at(this.questionIndex)?.get('timer')
            ?.disabled
        ) {
          this.nextQuestion(this.questionIndex);
        }
      });
  }

  answer(questionIndex: number, correctOptions: string) {
    if (!this.FormArray.at(questionIndex).get('timer')?.disabled) {
      let selectedAnswer =
        this.question[questionIndex].answer.id == correctOptions;
      if (selectedAnswer && correctOptions) {
        this.points = this.points += this.positivePoints;
        this.correctanswer++;
      } else if (!selectedAnswer && correctOptions) {
        this.points = this.points -= this.negativePoints;
        this.inCorrectanswer++;
      }
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
