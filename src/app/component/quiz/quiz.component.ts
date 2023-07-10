import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  interval,
  Subscription,
  ReplaySubject,
  takeUntil,
  Observable,
  distinctUntilChanged,
} from 'rxjs';

import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '@app/service/authentication.service';
import quizData from '@assets/json/data.json';
import dialogData from '@assets/json/dialogData.json';
import { DialogService } from '@app/dialog-service/dialog.service';
import { State, Store } from '@ngrx/store';
import {
  getAllQuiz,
  selectQuiz,
  successQuizPlay
} from '@app/store/quiz/quiz.action';
import { quizState } from '@app/store/quiz/quiz.state';
import { addResults } from '@app/store/result/result.action';
import { Result } from '@app/store/result/result.model';

@Component({
  selector: 'app-questions',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class Quizcomponent implements OnInit, OnDestroy {
  quizData = { ...quizData };
  @ViewChild('carousel')
  carousel!: NgbCarousel;
  quizForm!: FormGroup;
  question!: any;
  title!: any;
  dialogData = { ...dialogData };
  private destroyer$: ReplaySubject<boolean> = new ReplaySubject(1);
  questionIndex: number = 0;
  interval$!: Subscription;
  points: number = 0;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  timer: number | undefined;
  positivePoints!: number;
  negativePoints!: number;
  selectedQuiz: any;
  loggedInUser$: Observable<any> | undefined;
  userData: any;
  selectedOptions: string[] = [];

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private store: Store,
    private state: State<quizState>
  ) {
    this.quizForm = this.fb.group({
      form: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getUserData();
    this.startCounter();
    this.getQuizData();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    let result;
    if (result) {
    }
    event.returnValue = false;
  }

  onClickCheck(card:any, questionIndex:number) {
    const patchValue: any = () => {
      let prevSelected = this.formArray.controls.at(questionIndex)?.value.radioValue || [];
      return prevSelected
    }
    let selectedValue = this.formArray.controls.at(questionIndex)?.value.radioValue == '' ? [] : patchValue();
    if (selectedValue.includes(card.id)) {
      const index = selectedValue.indexOf(card.id);
      selectedValue.splice(index, 1);
    } else {
      selectedValue.push(card.id);
    }
    this.formArray.controls.at(this.questionIndex)?.get('radioValue')?.patchValue(selectedValue)
    this.formArray.controls[questionIndex].markAsDirty();
  }


  getQuizData() {
    if (!this.state.getValue().quiz.allQuiz) {
      this.store.dispatch(getAllQuiz());
    }
    this.store
      .select((state: any) => state.quiz.selectedQuiz)
      .pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.getQuestionData(data);
        this.selectedQuiz = data;
      });
    if (!this.selectedQuiz) {
      const selectedQuizId = this.activeRouter.snapshot.queryParamMap.get(
        'quiz'
      ) as string;
      this.store.dispatch(selectQuiz({ quizId: selectedQuizId }));
    }
  }

  getQuestionData(data: any) {
    if (!data) {
      return;
    }

    this.timer = data?.timer;
    this.positivePoints = data?.positivePoints;
    this.negativePoints = data?.negativePoints;
    const arrCopy: any = [...data?.questions];
    this.question = arrCopy;
    this.question = this.question
      ?.sort(() => Math.random() - 0.67)
      .splice(0, data?.numberOfQuestions);

    const formArray = this.quizForm.controls['form'] as FormArray;
    this.question?.forEach((item: any) => {
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
    this.answer(
      questionIndex,
      this.formArray.controls[questionIndex].value.radioValue
    );
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
    let result: Result = {
      points: this.points,
      correctAnswer: this.correctAnswer,
      inCorrectAnswer: this.inCorrectAnswer,
      type: this.selectedQuiz?.quizId,
      user: this.userData.id,
      quizTypeImage: this.selectedQuiz?.image,
      date: new Date().toISOString().slice(0, 10)
    };
    this.store.dispatch(addResults({ result }));
    this.store.dispatch(successQuizPlay({ result: result }));

    this.router.navigateByUrl('result');
  }

  skipQuestion(questionindex: number) {
    let configData = this.dialogData.skipModel;
    this.dialogService.openDialog(configData).then((value) => {
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
      .pipe(takeUntil(this.destroyer$))
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

  answer(questionIndex: number, selectedOption: any) {
    if (!this.formArray.at(questionIndex).get('timer')?.disabled) {
      if (this.question[questionIndex].answer?.id == selectedOption || this.checkAndValidate(selectedOption,questionIndex)) {
        this.points = this.points += this.positivePoints;
        this.correctAnswer++;
      } else if (!(this.question[questionIndex].answer?.id == selectedOption)) {
        this.points = this.points -= this.negativePoints;
        this.inCorrectAnswer++;
      }
    }
  }


  checkAndValidate(selectedOption:any, questionIndex:any) {
    let isCorrect = true;
    if(this.question[questionIndex].answer?.length > 0 ) {
      selectedOption?.sort((a:any, b:any) => a - b);
      const answerlist = this.question[questionIndex].answer;
      answerlist.map((ans:any, i:any) => {
        if (ans?.id != selectedOption[i]) {
            isCorrect = false;
        } 
      })
    }
    return isCorrect;
  }

  getUserData() {
    this.loggedInUser$ = this.store.select(
      (state: any) => state.authentication
    );
    this.loggedInUser$
      .pipe(takeUntil(this.destroyer$), distinctUntilChanged())
      .subscribe((state) => {
        this.userData = state?.userData;
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
