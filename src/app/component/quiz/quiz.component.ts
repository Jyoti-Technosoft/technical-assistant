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
import { interval, ReplaySubject, takeUntil } from 'rxjs';
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
  correctAnswer: number = 0;
  wrongAnswer: number = 0;

  @ViewChild('carousel')
  carousel!: NgbCarousel;
  myForm!: FormGroup;
  question!: any;
  dialogData = { ...dialogData };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  questionindex = 0;
  counter = 30;
  interval$: any;
  points: number = 0;
  correctanswer: number = 0;
  inCorrectanswer: number = 0;
  filterquestionsindex: any;
  timer: any;
  selectedQuizType: any;
  radioValue: any;
  options: string | number | undefined;

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
    this.filterquestionsindex = this.questionindex;
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
    let data: any = this.quizData.Quiz.find(
      (data) => data.quizId == this.selectedQuizType
    )?.questions;
    this.question = [...data];
    this.question = this.question?.sort(() => Math.random() - 0.67);
    this.question = [...this.question?.splice(0, 10)];
    this.options = this.question.map((question: any) =>
      question.options.sort(() => Math.random() - 0.69)
    );
    this.timer = this.quizData.Quiz.find(
      (data) => data.quizId == this.selectedQuizType
    )?.timer;

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

  next(questionindex: number): void {
    this.carousel.next();
    const values = this.FormArray.controls[questionindex].value.radioValue;
    this.answer(questionindex, values);
    this.disabledValuesAndForm();
    this.questionindex = questionindex + 1;
    if (this.questionindex == this.question.length) {
      this.submit();
    }
  }

  prev(questionindex: number) {
    this.questionindex = questionindex - 1;
    this.carousel?.prev();
  }

  submit() {
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

  skip(questionindex: number) {
    let label = this.dialogData.skipModel.label;
    let yesButtonLable = this.dialogData.skipModel.yesButtonLable;
    let NoButtonLable = this.dialogData.skipModel.NoButtonLable;
    this.dialogService
      .openDialog(label, yesButtonLable, NoButtonLable)
      .then((value) => {
        if (value) {
          this.questionindex = questionindex;
          this.next(this.questionindex);
        }
      });
  }

  disabledValuesAndForm() {
    this.FormArray.controls
      .at(this.questionindex)
      ?.get('radioValue')
      ?.disable();
    this.FormArray.controls.at(this.questionindex)?.get('timer')?.disable();
    this.FormArray.controls.at(this.questionindex)?.markAsDirty();
  }

  startCounter() {
    this.interval$ = interval(1000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((val) => {
        const counterValue = this.FormArray.controls.at(this.questionindex)
          ?.value.timer;
        if (
          Number(counterValue) != 0 &&
          !this.FormArray.controls.at(this.questionindex)?.get('timer')
            ?.disabled
        ) {
          this.FormArray.controls
            .at(this.questionindex)
            ?.patchValue({ timer: counterValue - 1 });
        } else if (
          Number(counterValue) === 0 &&
          !this.FormArray.controls.at(this.questionindex)?.get('timer')
            ?.disabled
        ) {
          this.next(this.questionindex);
        }
      });
  }

  answer(questionindex: number, correctOptions: string) {
    if (!this.FormArray.at(questionindex).get('timer')?.disabled) {
      let selectedAnswer =
        this.question[questionindex].answer?.[0] == correctOptions;
      if (selectedAnswer && correctOptions) {
        this.points = this.points += 1;
        this.correctanswer++;
      } else if (!selectedAnswer && correctOptions) {
        this.points = this.points -= 0.25;
        this.inCorrectanswer++;
      }
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
