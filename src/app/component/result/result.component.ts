import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuestionService } from '../../service/question.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit, OnDestroy {
  userName: any;
  submittedData: any;

  constructor(public questionService: QuestionService) {}

  ngOnInit(): void {
    this.resultData();
    if (!this.userName) {
      this.getData();
    }
  }

  getData() {
    let data: any = localStorage.getItem('registeruser');
    this.userName = JSON.parse(data).find((data: any) => {
      return data.id == this.questionService.getUser();
    })?.fullname;
  }

  resultData() {
    let data: any = localStorage.getItem('result');
    this.submittedData = JSON.parse(data).filter((data: any) => {
      return data?.user == this.questionService.getUser();
    });
    this.submittedData = this.submittedData.splice(
      this.submittedData.length - 1,
      1
    );
  }

  ngOnDestroy(): void {}
}
