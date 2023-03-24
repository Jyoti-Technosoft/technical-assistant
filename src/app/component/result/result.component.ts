import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuestionService } from '../../service/question.service';
import { Params, Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  userName: any;
  allResultData: any;

  constructor(
    public questionService: QuestionService,
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
      return data.id == this.questionService.getUser();
    })?.fullName;
  }

  resultData() {
    let data: any = localStorage.getItem('result');
    this.allResultData = JSON.parse(data).filter((data: any) => {
      return data?.user == this.questionService.getUser();
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
