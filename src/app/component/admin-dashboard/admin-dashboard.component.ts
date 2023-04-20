import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, distinctUntilChanged, takeUntil } from 'rxjs';

import quizData from '@assets/json/data.json';
import { Store } from '@ngrx/store';
import { getAllQuiz, selectQuiz } from '@app/store/quiz/quiz.action';
import { DialogService } from '@app/dialog-service/dialog.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  quizData = { ...quizData };
  destroy$: ReplaySubject<boolean> = new ReplaySubject();
  quizs: any[] = [];
  cardData: number = 8;
  searchText = '';

  constructor(
    private store: Store,
    private dialogService:DialogService
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

  loadMore() {
    this.cardData = this.cardData + 8;
  }
  ngOnDestroy() {}
}
