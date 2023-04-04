import { Component } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { autenticationState } from '@app/store/autentication/autentication.state';

@Component({
  selector: 'app-allresults',
  templateUrl: './allresults.component.html',
  styleUrls: ['./allresults.component.scss']
})
export class AllresultsComponent {
  initialData: number = 8;
  allResultData: any[] = [];
  loggedInUser$: Observable<any> | undefined;
  userData: any;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();
  avatarName!:string;

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    private store: Store<autenticationState>
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
    let data: any = localStorage.getItem('result');
    this.allResultData = JSON.parse(data).reverse();
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
    this.initialData = this.initialData + 8;
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
