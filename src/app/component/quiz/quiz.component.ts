import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
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
import { ModalDismissReasons, NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dialogData from '@assets/json/dialogData.json';
import { DialogService } from '@app/dialog-service/dialog.service';
import { State, Store } from '@ngrx/store';
import {
  getAllQuiz,
  selectQuiz,
  successQuizPlay,
} from '@app/store/quiz/quiz.action';
import { quizState } from '@app/store/quiz/quiz.state';
import { addResults } from '@app/store/result/result.action';
import { Result } from '@app/store/result/result.model';

@Component({
  selector: 'app-questions',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .dark-modal .modal-content {
        background-color: #292b2c;
        color: white;
      }
      .dark-modal .close {
        color: white;
      }
      .light-blue-backdrop {
        background-color: #5cb3fd;
      }
    `,
  ],
})
export class Quizcomponent implements OnInit, OnDestroy {
  // quizData = { ...quizData };
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
  notSelect: any = 0;
  allQuiz: any;
  numberOfQuestions: any;
  skipButton: boolean = true;
  nextButton: boolean = false;

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private store: Store,
    private state: State<quizState>,
    private modalService: NgbModal,
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
  @ViewChild('content') myModal: any;
  closeResult: any;

  onClickCheck(card: any, questionIndex: number) {

    // console.log("skipButton  : ", this.skipButton);
    // console.log("nextButton  : ", this.nextButton);
    // this.skipButton = this.skipButton ? false : true;
    // this.nextButton = this.nextButton ? false : true;
    const patchValue: any = () => {
      let prevSelected =
        this.formArray.controls.at(questionIndex)?.value.radioValue;
    // console.log("prevSelected  : ", prevSelected);
      return prevSelected;
    };
    let selectedValue =
      this.formArray.controls.at(questionIndex)?.value.radioValue == ''
        ? []
        : patchValue();

    // console.log("selectedValue  : ", selectedValue);
    // console.log("selectedValue length  : ", selectedValue.length);

    if(
      ((selectedValue == 1 || selectedValue != '') && selectedValue.length == 1) ||
      ((selectedValue == 1 || selectedValue != '') && selectedValue.length == 2) ||
      ((selectedValue == 1 || selectedValue != '') && selectedValue.length == 3) ||
      ((selectedValue == 1 || selectedValue != '') && selectedValue.length == 4)) {
      debugger
      console.warn(`if  : ${selectedValue} : ${selectedValue.length}`);
      this.skipButton = false;
      this.nextButton = true;
    } else if((selectedValue == 1 && selectedValue.length == 1)) {
      console.warn(`else if : ${selectedValue} : ${selectedValue.length}`);
      this.skipButton = true;
      this.nextButton = false;
    }

    // if(selectedValue) {
    //   this.skipButton = false;
    //   this.nextButton = true;
    // } else if(!selectedValue) {
    //   this.skipButton = true;
    //   this.nextButton = false;
    // }

    if (selectedValue.includes(card.id)) {
      const index = selectedValue.indexOf(card.id);
      selectedValue.splice(index, 1);
    } else {
      selectedValue.push(card.id);
    }
    this.formArray.controls
      .at(this.questionIndex)
      ?.get('radioValue')
      ?.patchValue(selectedValue);
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
      this.numberOfQuestions = data.numberOfQuestions;

    const formArray = this.quizForm.controls['form'] as FormArray;
    this.question?.forEach((item: any) => {
      formArray.push(
        this.fb.group({
          radioValue: '',
          timer: this.timer,
        })
      );
    });
    console.log("formArray  : ", formArray.value);
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  submitQuiz() {
    let result: Result = {
      points: this.points,
      correctAnswer: this.correctAnswer,
      inCorrectAnswer: this.inCorrectAnswer,
      type: this.selectedQuiz?.quizId,
      user: this.userData.id,
      quizTypeImage: this.selectedQuiz?.image,
      date: new Date().toISOString().slice(0, 10),
      skipQuestion: this.notSelect,
      totalQuestions: this.numberOfQuestions
    };
    this.store.dispatch(addResults({ result }));
    this.store.dispatch(successQuizPlay({ result: result }));
    this.modalService
      .open(this.myModal, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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
    // this.formArray.controls.at(this.questionIndex)?.get('timer')?.disable();
    // this.formArray.controls.at(this.questionIndex)?.markAsDirty();
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
    if (selectedOption == '') {
      this.notSelect++;
    }
    let a = JSON.stringify(this.question[questionIndex].answer.id);
    let b = JSON.stringify(selectedOption);
    let c = a === b;
    if (!this.formArray.at(questionIndex).get('timer')?.disabled) {
      if(c) {
        if (c && this.checkAndValidate(selectedOption, questionIndex)) {
          this.points = this.points += this.positivePoints;
          this.correctAnswer++;
        }
      } else {
        if(selectedOption != "") {
          this.points = this.points -= this.negativePoints;
          this.inCorrectAnswer++;
        }
      }
    }
  }

  checkAndValidate(selectedOption: any, questionIndex: any) {
    let isCorrect = true;
    if (this.question[questionIndex].answer?.length > 0) {
      selectedOption?.sort((a: any, b: any) => a - b);
      const answerlist = this.question[questionIndex].answer;
      answerlist.map((ans: any, i: any) => {
        if (ans?.id != selectedOption[i]) {
          isCorrect = false;
        }
      });
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

  onExit() {
    let configData = this.dialogData.exitQuizModel;
    this.dialogService.openDialog(configData).then((value) => {
      value ? this.router.navigate(['/dashboard']) : '';
     });
  }

  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
