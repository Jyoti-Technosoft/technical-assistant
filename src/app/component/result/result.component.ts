import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

import { QuestionService } from '../../service/question.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  userName: any;
  allResultData: any;

  constructor(public questionService: QuestionService, public router: Router) {}

  ngOnInit(): void {
    this.resultData();
    if (!this.userName) {
      this.getUserData();
    }
  }

  getUserData() {
    let data: any = localStorage.getItem('registerUser');
    this.userName = JSON.parse(data).find((data: any) => {
      return data.id == this.questionService.getUser();
    })?.fullName;
  }

  resultData() {
    let data: any = localStorage.getItem('result');
    data = JSON.parse(data).filter((data: any) => {
      return data?.user == this.questionService.getUser();
    });
    const sorter = (a: any, b: any) => {
      return new Date(a.date) > new Date(b.date) ? a : b;
    };
    this.allResultData = data?.reduce(sorter);
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
