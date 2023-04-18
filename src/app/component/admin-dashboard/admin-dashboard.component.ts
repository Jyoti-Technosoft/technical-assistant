import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, distinctUntilChanged, takeUntil } from 'rxjs';
import dialogData from '@assets/json/dialogData.json';

import quizData from '@assets/json/data.json';
import { Store } from '@ngrx/store';
import { deleteQuiz, getAllQuiz } from '@app/store/quiz/quiz.action';
import { DialogService } from '@app/dialog-service/dialog.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  allQuizUrl = "http://localhost:3000/quiz";
  quizData = { ...quizData };
  dialogData = { ...dialogData };
  destroy$: ReplaySubject<boolean> = new ReplaySubject();
  quizs: any[] = [];
  cardData: number = 8;
  searchText = '';

  constructor(
    private store: Store,
    private dialogService:DialogService,
    private http: HttpClient
    ) {}

  ngOnInit(): void {
    this.store
      .select((state: any) => state.quiz)
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((data) => {
        this.quizs = data?.allQuiz;
      });
    if (!this.quizs?.length) {
      this.store.dispatch(getAllQuiz());
    }
  }

  addQuizData(){
    this.dialogService.openAddQuizDialog()
  }

  openDeleteDialog(id:number) {
    let configData = this.dialogData.signoutModel;
    this.dialogService.openDialog(configData).then((value) => {
      if (value) {
        this.store.dispatch(deleteQuiz({id}))
      }
    });
  }

  loadMore() {
    this.cardData = this.cardData + 8;
  }
  ngOnDestroy() {}
}
