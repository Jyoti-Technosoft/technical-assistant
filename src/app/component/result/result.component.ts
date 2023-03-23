import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import quizData from 'src/assets/json/data.json';
import { Params, Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  quizData = { ...quizData };
  userName: any;
  userData: any;
  submittedData: any;

  constructor(
    public authenticationService: AuthenticationService,
    public router:Router
    ) {}

  ngOnInit(): void {
    this.userName = this.authenticationService?.userName;
    this.resultData();
    if (!this.userName) {
      this.getData();
    }
  }

  getData() {
    let data: any = localStorage.getItem('registeruser');
    this.userData = JSON.parse(data);
    this.userName = this.userData.find((data: any) => {
      return data.id == this.authenticationService.getUser();
    })?.fullname;
  }

  resultData() {
    let data: any = localStorage.getItem('result');
    this.submittedData = JSON.parse(data);
    this.submittedData = this.submittedData.filter((data: any) => {
      return data?.user == this.authenticationService.getUser();
    });
    this.submittedData = this.submittedData.map((data: any) => {
      const message = this.quizData?.quiz?.find((quizData: any) => {
        return quizData.quizId == data.type;
      });
      data.image = message?.image;
      return data;
    });
    this.submittedData = this.submittedData?.reverse();
  }

  startQuizAgain(quizName:string){
    const queryParams: Params = { quiz: quizName };
    this.router.navigate(['/quizname'], { queryParams });
  }

  ngOnDestroy(): void {}
}
