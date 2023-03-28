import { Component } from '@angular/core';
import { Params , Router } from '@angular/router';
import { QuestionService } from 'src/app/service/question.service';

@Component({
  selector: 'app-allresults',
  templateUrl: './allresults.component.html',
  styleUrls: ['./allresults.component.scss']
})

export class AllresultsComponent {
  userName: any;
  initialData: number = 8;
  allResultData: any[] = [];

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

  ngOnDestroy(): void {}
}
