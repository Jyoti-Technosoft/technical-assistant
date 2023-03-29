import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

import { AuthenticationService } from '@app/service/authentication.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  userName: any;
  allResultData: any;

  constructor(
    public authenticationService: AuthenticationService,
    public router:Router
    ) {}

  ngOnInit(): void {
    this.resultData();
    if (!this.userName) {
      this.getUserData();
    }
  }

  getUserData() {
    let data: any = localStorage.getItem('registerUser');
    this.userName = JSON.parse(data).find((data: any) => {
      return data.id == this.authenticationService.getUser();
    })?.fullName;
  }

  resultData() {
    let data: any = localStorage.getItem('result');
    this.allResultData = JSON.parse(data).filter((data: any) => {
      return data?.user == this.authenticationService.getUser();
    });
    const sorter = (a: any, b: any) => {
      console.log(a,b)
      return new Date(a.date) > new Date(b.date) ? a : b;
    };
    this.allResultData = this.allResultData?.reduce(sorter);
  }

  startQuizAgain(quizName: string) {
    const queryParams: Params = { quiz: quizName };
    this.router.navigate(['/quizname'], { queryParams });
  }

  showAllQuiz() {
    const queryParams: Params = { result: 'allresults' };
    this.router.navigate(['/allresults'], { queryParams });
  }

  ngOnDestroy(): void {}
}
