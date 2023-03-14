import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuestionService } from '../../service/question.service';
import quizData from 'src/assets/json/data.json';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit, OnDestroy {
  quizData = { ...quizData };
  userName: any;
  userData: any;
  submittedData: any;

  constructor(public questionService: QuestionService) {}

  ngOnInit(): void {
    this.userName = this.questionService?.userName;
    this.resultData();
    if (!this.userName) {
      this.getData();
    }
  }

  getData() {
    let data: any = localStorage.getItem('registeruser');
    this.userData = JSON.parse(data);
    this.userName = this.userData.find((data:any)=>{
      return data.id == this.questionService.getUser()
    })?.fullname;
  }

  resultData() {
    let data: any = localStorage.getItem('result');
    this.submittedData = JSON.parse(data);
    this.submittedData = this.submittedData.filter((data: any) => {
      return data?.user == this.questionService.getUser();
    });
    this.submittedData = this.submittedData.map((data: any) => {
      const message = this.quizData?.Quiz?.find((quizData: any) => {
        return quizData.quizId == data.type;
      });
      data.image = message?.image;
      return data;
    });
    this.submittedData = this.submittedData?.reverse();
  }

  againQuiz() {
    window.location.reload();
  }

  ngOnDestroy(): void {}
}
