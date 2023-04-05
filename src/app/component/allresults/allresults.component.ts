import { Component } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { resultState } from '@app/store/result/result.state';
import { getAllResults } from '@app/store/result/result.action';

@Component({
  selector: 'app-allresults',
  templateUrl: './allresults.component.html',
  styleUrls: ['./allresults.component.scss']
})
export class AllresultsComponent {
  initialData: number = 12;
  allResultData: any[] = [];
  loggedInUser$: Observable<any> | undefined;
  userData: any;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();
  avatarName!:string;

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    private store: Store<resultState>
  ) {}

  ngOnInit(): void {
    this.resultData();
    this.getUserData();
  }

  getUserData() {
    this.loggedInUser$ = this.store.select(
      (state: any) => state.authentication
    );
    this.loggedInUser$
      .pipe(takeUntil(this.destroyer$), distinctUntilChanged())
      .subscribe((state) => {
        this.userData = state?.userData;
        this.avatarName = this.getUserLetter(this.userData?.fullName);
      });
  }

  resultData() {
    this.store.dispatch(getAllResults());
  }

  getUserLetter(userName: string) {
    const intials = userName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
    return intials;
  }

  loadMoreData() {
    this.initialData = this.initialData + 12;
  }

  startQuizAgain(quizName: string) {
    const queryParams: Params = { quiz: quizName };
    this.router.navigate(['/quizname'], { queryParams });
  }

  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }
}
