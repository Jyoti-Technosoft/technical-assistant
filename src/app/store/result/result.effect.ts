import { OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { distinctUntilChanged, of, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as resultAction from '@app/store/result/result.action';
import { Result } from '@app/store/result/result.model';
import { ResultService } from '@app/store/result/result.service';

@Injectable()
export class ResultEffects implements OnDestroy {
  constructor(
    private actions$: Actions,
    private resultService: ResultService
  ) {}

  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  getAllResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resultAction.getAllResults),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      switchMap(() => {
        return this.resultService.getResult().pipe(
          map((result: Result[]) => {
            return resultAction.getAllResultsSuccess({ result });
          }),
          catchError((error) => of(resultAction.handlErrors({ error })))
        );
      })
    )
  );

  handleErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resultAction.handlErrors),
      takeUntil(this.destroyer$),
      distinctUntilChanged(),
      tap((data) => {
        this.resultService.getResultFailed(data);
      })
    )
  );

  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
