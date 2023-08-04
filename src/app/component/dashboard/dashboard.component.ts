import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { ReplaySubject, distinctUntilChanged, max, takeUntil } from 'rxjs';

import quizData from '@assets/json/data.json';
import { Store } from '@ngrx/store';
import { getAllQuiz, selectQuiz } from '@app/store/quiz/quiz.action';
import { getAllResults } from '@app/store/result/result.action';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  quizData = { ...quizData };
  destroy$: ReplaySubject<boolean> = new ReplaySubject();
  quizs: any[] = [];
  resultData: any = {};
  cardData: number = 8;
  resultData$: any;
  allResultData: any;
  highestPoints: any;
  hightestTechPlayed: any;
  maxPoints: any;
  minPoints: any;

  constructor(private route: Router, private store: Store) {}

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
    this.getUserResultData();
    this.getHeightestQuiz();
  }

  getUserResultData() {
    this.resultData$ = this.store.select((state: any) => state.result);
    this.resultData$
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((state: any) => {
        this.allResultData = state?.results;
        this.strucutreResultData(state?.results);
      });
    if (!this.allResultData) {
      this.store.dispatch(getAllResults());
    }
  }
  strucutreResultData(data: any) {
    this.allResultData = data;
    if (data) {
      this.resultData = this?.getMostValue(data);
      this.highestPoints = this.getMinValue(data);
    }
  }
  getHeightestQuiz() {
    var result = this.allResultData.map((a: any) => a.type);
    this.hightestTechPlayed =  result.sort((a:any,b:any) =>
    result.filter((v:any) => v===a).length
  - result.filter((v:any) => v===b).length
  ).pop();
  }

  getMostValue(array: any) {
    this.maxPoints = Math?.max(...array?.map((obj: any) => obj?.points));
  }

  getMinValue(array: any) {
    this.minPoints = Math?.min(...array?.map((obj: any) => obj?.points));
  }

  startQuiz(title: string) {
    this.store.dispatch(selectQuiz({ quizId: title }));
    const queryParams: Params = { quiz: title };
    this.route.navigate(['/quizname'], { queryParams });
  }

  loadMore() {
    this.cardData = this.cardData + 8;
  }
  ngOnDestroy() {}
}
