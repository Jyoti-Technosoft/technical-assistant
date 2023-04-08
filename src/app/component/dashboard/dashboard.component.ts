import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { ReplaySubject, distinctUntilChanged, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

import { getAllQuiz, selectQuiz } from '@app/store/quiz/quiz.action';
import quizData from '@assets/json/data.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
  quizData = { ...quizData };
  destroy$:ReplaySubject<boolean> = new ReplaySubject();
  quizs: any[] = [];
  cardData: number = 8;

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
  }

  startQuiz(title: string) {
    this.store.dispatch(selectQuiz({ quizId: title }));
    const queryParams: Params = { quiz: title };
    this.route.navigate(['/quiz'], { queryParams });
  }

  loadMore() {
    this.cardData = this.cardData + 8;
  }
  ngOnDestroy() {}
}
