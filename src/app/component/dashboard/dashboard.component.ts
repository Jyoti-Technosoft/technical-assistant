import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { ReplaySubject, distinctUntilChanged, takeUntil } from 'rxjs';

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
  resultData:any = {};
  cardData: number = 8;
  resultData$: any;
  allResultData: any;

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

    this.resultData = this.getMostValue(data); 
  }

  getMostValue(array:any) {
    if(!array?.length)
        return null;
    let modeMap:any = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {

            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
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
