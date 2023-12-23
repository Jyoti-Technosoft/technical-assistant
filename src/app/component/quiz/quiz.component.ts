import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Subscription,
} from 'rxjs';
import { ModalDismissReasons, NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dialogData from '@assets/json/dialogData.json';
import { DialogService } from '@app/dialog-service/dialog.service';
import { QuizDataService } from '@app/service/quiz-data.service';
import { AuthenticationService } from '@app/service/authentication.service';
import { ResultService } from '@app/service/result.service';
import { LOCALSTORAGE_KEY, MESSAGE } from '@app/utility/utility';
import { SnackbarService } from '@app/service/snackbar.service';

@Component({
  selector: 'app-questions',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  @ViewChild('content') myModal: any;
  @ViewChild('carousel')
  carousel!: NgbCarousel;
  dialogData = { ...dialogData };
  closeResult: any;
  quizForm!: FormGroup;
  quizInfo:any = {};
  questionsData: any;
  subRandomQueList:any = {};
  selectedQuiz = '';
  subs: Subscription;
  selectedAns: any = [];
  currentIndex = 0;
  isMobileView = false;
  userId!: number;

  // result
  positivePoints = 0;
  negativePoints = 0;
  correctAnswer = 0;
  inCorrectAnswer = 0;
  skipAnswer = 0;
  totalPoints = 0;

  // timer related
  timerInterval:any;
  isStartTimer = false;

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private activeRouter: ActivatedRoute,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private quizservice: QuizDataService,
    private modalService: NgbModal,
    private resultService: ResultService,
    private snackBarService: SnackbarService,
    private cd: ChangeDetectorRef
  ) {

    this.subs = new Subscription();
    if (!this.selectedQuiz) {
      this.selectedQuiz = this.activeRouter.snapshot.queryParams['quiz'];
    }
    this.userId = auth.getUserId();
  }

  ngOnInit(): void {

    this.auth.getScreenSize().subscribe(v => {
      this.isMobileView = v;
      this.cd.detectChanges();
    });

    window.history.forward();
    window.addEventListener("keyup", this.disableF5);
    window.addEventListener("keydown", this.disableF5);

    this.quizInfo = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY.QUIZ_DETAILS) as string);
    this.getQuestionList();
  }

  disableF5(e:any): void {

    if ((e.which || e.keyCode) == 116) e.preventDefault();
  };

  getQuestionList(): void {

    const quizData = this.quizservice.getListOfQuizDetails(this.quizInfo.file).subscribe({
      next: (res) => {
        if (!!res) {
          this.questionsData = res;
          this.getQuestionData(this.quizInfo, this.questionsData);
          this.cd.detectChanges();
        }
      },
      error: () => {
        this.snackBarService.error(MESSAGE.QUESTION_FAILED);
      }
    });
    this.subs.add(quizData);
  }

  createQueForm(queData: any): void {

    this.quizForm = this.fb.group({
      id: queData?.id,
      queList: this.fb.array([])
    });
    this.addQueList(queData.questions);
  }

  queList(): FormArray {

    return this.quizForm?.get("queList") as FormArray
  }

  addQueList(data: any): void {

    data.forEach((que:any, i:number) => {
      this.queList().push(
        this.fb?.group({
        question: que?.question,
        selectedAnswer: [],
        timer: this.quizInfo?.timer,
        next: 0,
        previous: 0,
        skip: 0,
        queType: que?.type,
        answers: [que?.answer]
      }));
    });

    this.startCounter(this.currentIndex);
  }


  getFormControlItem(): any {

    return ((this.quizForm?.controls['queList'] as FormArray).controls as FormGroup[])
  }

  exitFromQuiz(): void {

    let configData = this.dialogData?.exitQuizModel;
    this.dialogService?.openDialog(configData).then((value) => {
      if (value) {
        this.router?.navigateByUrl('dashboard');
        localStorage.removeItem(LOCALSTORAGE_KEY.QUIZ_DETAILS);
        this.snackBarService.success(MESSAGE.EXIT_FROM_QUIZ);
      }
    });
  }

  onSelectAnswer(ans: any, i: number): void {

    const formData = this.queList().controls[i].getRawValue();

    let skipValue = formData.skip;
    let previousValue = formData.previous;
    let nextValue = formData.next;
    let timerValue = formData.timer;
    let queType = formData.queType;

    if (timerValue === 0 && nextValue && skipValue) {
      this.snackBarService.error(MESSAGE.TIMER_OFF);
    } if (timerValue !== 0 && nextValue) {
      this.snackBarService.error(MESSAGE.MISSED_OUT);
    } else {
      if (((skipValue || previousValue) && !nextValue) || (!skipValue && !previousValue && !nextValue)) {

        if (queType === 'checkbox') {
          if (this.selectedAns.includes(ans.id)) {
            this.selectedAns = this.selectedAns.filter((value:number) => value !== ans.id);
          } else {
            this.selectedAns.push(ans.id);
          }
        } else {
          this.selectedAns = [];
          this.selectedAns.push(ans.id);
        }

        let ansControl = this.queList().controls[i];
        ansControl.patchValue({
          selectedAnswer: this.selectedAns
        });
      } else {
        if (timerValue === 0 && !this.selectedAns) {
          this.snackBarService.error(MESSAGE.TIMER_OFF);
        } else {
          this.snackBarService.error(MESSAGE.NO_ANS_SELECTION);
        }
      }
    }
  }

  checkSelected(selectedId: number): boolean {

    if (this.selectedAns?.includes(selectedId) && !!this.selectedAns.length) {
      return true;
    } else {
      return false;
    }
  }

  getQuestionData(info:any, queData: any): void {

    if (!queData) {
      return;
    }

    this.positivePoints = info?.positivePoints;
    this.negativePoints = info?.negativePoints;

    let allLevelQueList = queData.list;

    let listOfAllQues:any = [];
    info?.testLevel.forEach((v:any) => {
      allLevelQueList[v].forEach((que:any) => {
        listOfAllQues.push(que);
      })
    });

    if (info?.numberOfQuestions > 0) {

      let randomQueList = listOfAllQues
        ?.sort(() => Math.random() - 0.67)
        .splice(0, info?.numberOfQuestions);

        this.subRandomQueList = {
        id: queData.id,
        questions: randomQueList
      }
      this.createQueForm(this.subRandomQueList);
    }
    this.cd.detectChanges();
  }

  get formArray() {

    return this.quizForm.controls['form'] as FormArray;
  }

  next(index: number): void {

    const formData = this.queList().controls[index];
    this.stopTimer();
    formData.patchValue({
      next: 1,
      previous: 0,
      skip: 0,
    });

    this.selectedAns = [];
    this.moveToNextQue(index);
  }

  previous(i: number): void {

    const formData = this.queList().controls[i];
    this.stopTimer();
    formData.patchValue({
      previous: 1,
      next: 0,
      skip: 0,
      selectedAnswer: null
    });

    this.selectedAns = [];
    this.currentIndex = i - 1;
    this.carousel.prev();
    this.moveToPreviousQuestion(this.currentIndex);
  }

  moveToPreviousQuestion(i: number): void {

    const formData = this.queList().controls[i];
    let skipValue = formData?.get('skip')?.value;
    let previousValue = formData?.get('previous')?.value;
    let nextValue = formData?.get('next')?.value;
    let timerValue = formData?.get('timer')?.value;

    if ((skipValue || previousValue) && !nextValue && timerValue !== 0) {
      this.startCounter(i);
    }
    if (nextValue) {
      this.selectedAns = this.queList().controls[i].get('selectedAnswer')?.value;
    }
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

  submitQuiz(): void {

    let testData = this.quizForm.getRawValue();

    testData?.queList.forEach((que:any) => {
      if (que.skip) {
        this.skipAnswer = this.skipAnswer + 1;
      } else {
        if (que?.next) {
          let equalsCheck = JSON.stringify(que?.answers) === JSON.stringify(que?.selectedAnswer)
          if (equalsCheck) {
            this.correctAnswer = this.correctAnswer + 1;
          } else {
            this.inCorrectAnswer = this.inCorrectAnswer + 1;
          }
        }
      }
    });

    let correct = this.correctAnswer * this.positivePoints;
    let wrong = this.inCorrectAnswer * this.negativePoints;
    this.totalPoints = correct - wrong;

    let result:any = {
      quiz_id: testData?.id,
      total_questions: this.quizInfo?.numberOfQuestions,
      points: this.totalPoints,
      skip_answer: this.skipAnswer,
      correct_answer: this.correctAnswer,
      incorrect_answer: this.inCorrectAnswer,
      user_id: Number(this.userId),
      quizTypeImage: this.quizInfo?.image,
      quiz_date: new Date().toISOString().slice(0, 10)
    };

    localStorage.setItem(LOCALSTORAGE_KEY.LAST_RESULT_DATA, JSON.stringify(result));

    let passData = {...result};
    delete passData?.quiz_date;
    delete passData?.quizTypeImage;

    const resultData = this.resultService.addResultData(passData).subscribe({
      next: (res) => {
        if (!res.success) {
          this.snackBarService.error(res.message);
        }
      },
      error: (err) => {
        this.snackBarService.error(err.error.message);
      }
    });
    this.subs.add(resultData);

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

  skip(data: any, index: number): void {

    let configData = this.dialogData.skipModel;
    this.dialogService.openDialog(configData).then((value) => {
      if (value) {
        const formData = this.queList().controls[index];
        this.stopTimer();
        formData.patchValue({
          question: data?.question,
          next: 0,
          previous: 0,
          skip: 1,
          selectedAnswer: null
        });
        this.selectedAns = [];
        this.moveToNextQue(index);
      }
    });
  }

  moveToNextQue(i: number): void {

    if (i === this.subRandomQueList?.questions?.length - 1) {
      this.submitQuiz();
    } else {
      this.carousel.next();
      this.currentIndex = i + 1;
      this.startCounter(this.currentIndex);
    }
  }

  startCounter(index: number): void {

    const formData = this.queList()?.controls[index];
    let timerValue = formData?.get('timer')?.value;

    this.isStartTimer = true;
    this.timerInterval = setInterval(() => {
      if (timerValue > 0) {
        timerValue = timerValue - 1;
        formData?.patchValue({
          timer: timerValue
        });
      } else if (timerValue === 0) {
        this.stopTimer();
        formData?.patchValue({
          timer: timerValue,
          next: 1,
          previous: 0,
          skip: 1,
          selectedAnswer: null
        });
        this.selectedAns = [];
        this.moveToNextQue(index);
      }
    }, 1000);
  }

  stopTimer(): void {

    this.isStartTimer = false;
    clearInterval(this.timerInterval);
  }

  ngOnDestroy() {
    localStorage.removeItem(LOCALSTORAGE_KEY.QUIZ_DETAILS);
    this.stopTimer();
    this.timerInterval = null;
    this.isStartTimer = false;
  }
}
