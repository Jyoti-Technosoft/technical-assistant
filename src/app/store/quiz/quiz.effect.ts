import { OnDestroy } from '@angular/core';
import { Injectable, Pipe } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { distinctUntilChanged, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as quizAction from './quiz.action';
import { QuizService } from './quiz.service';

@Injectable()
export class quizEffects implements OnDestroy {
  constructor(private actions$: Actions, private quizService: QuizService) {}

  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  getAllQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(quizAction.getAllQuiz),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      switchMap(() => {
        return this.quizService
          .getAllQuiz()
          .pipe(map((quizes) =>{ return quizAction.AllQuizSucess({ quizes })}));
      })
    )
  );

  getSelecteQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(quizAction.selectQuiz),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      switchMap((quiz) => {
        return this.quizService.getSelectedQuiz(quiz.quizId).pipe(
          map((quiz) => quizAction.selectQuizSucess({ quiz })),
          catchError((error: any) => of(quizAction.selectQuizError({ error })))
        );
      })
    )
  );

  handleSelectedQuizError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(quizAction.selectQuizError),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      tap((data: any) => {
        this.quizService.showError(data?.error?.message);
      })
    )
  );

  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
