import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

import { AuthenticationService } from '../../service/authentication.service';

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
      this.getData();
    }
  }

  getData() {
    let data: any = localStorage.getItem('registerUser');
    this.userName = JSON.parse(data).find((data: any) => {
      return data.id == this.authenticationService.getUser();
    })?.fullName;
  }

  resultData() {
    this.allResultData = this.allResultData.filter((data: any) => {
      return data?.user == this.authenticationService.getUser();
    });
    this.allResultData = this.allResultData.splice(
      this.allResultData.length - 1,
      1
    );
  }

  startQuizAgain(quizName:string){
    const queryParams: Params = { quiz: quizName };
    this.router.navigate(['/quizname'], { queryParams });
  }

  ngOnDestroy(): void {}
}
