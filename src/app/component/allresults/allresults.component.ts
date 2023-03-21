import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuestionService } from '../../service/question.service';
import quizData from 'src/assets/json/data.json';

@Component({
  selector: 'app-allresults',
  templateUrl: './allresults.component.html',
  styleUrls: ['./allresults.component.css']
})
export class AllresultsComponent implements OnInit, OnDestroy {
  quizData = { ...quizData };
  userName: any;
  userData: any;
  submittedData: any;
  initialData:number = 8;
  showMoreData:any;
  allResultData: any;

  constructor(public questionService: QuestionService) {}

  ngOnInit(): void {
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
    this.allResultData = JSON.parse(data); 
    this.allResultData = this.allResultData?.filter((data: any) => {
      return data?.user == this.questionService.getUser();
    });
    this.allResultData = this.allResultData?.map((data: any) => {
      const message = this.quizData?.quiz?.find((quizData: any) => {
        return quizData.quizId == data.type;
      });
      data.image = message?.image;
      return data;
    });
    this.allResultData = this.allResultData?.reverse();
    this.submittedData = this.allResultData.slice(0,this.initialData);
  }

  initialLetter(userName:string) {
    const intials = userName.split(' ').map(name => name[0]).join('').toUpperCase();
    return intials
  }

  loadMoreData() {
    this.showMoreData = this.initialData += 8;
    this.submittedData = this.allResultData.slice(0,this.showMoreData);
  }

  ngOnDestroy(): void {
    
  }

}
