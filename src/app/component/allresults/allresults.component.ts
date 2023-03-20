import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuestionService } from '../../service/question.service';

@Component({
  selector: 'app-allresults',
  templateUrl: './allresults.component.html',
  styleUrls: ['./allresults.component.css'],
})
export class AllresultsComponent implements OnInit, OnDestroy {
  userName: any;
  initialData: number = 8;
  allResultData: any[] | undefined;

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
    this.allResultData = JSON.parse(data).reverse();
  }

  initialLetter(userName: string) {
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

  checkDisable(): boolean {
    return Number(this.allResultData?.length) <= this.initialData;
  }

  ngOnDestroy(): void {}
}
