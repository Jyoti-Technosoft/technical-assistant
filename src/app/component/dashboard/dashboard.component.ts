import { Component,OnDestroy,OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import quizData from '../../../assets/json/data.json';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,OnDestroy {
  quizData = {...quizData};
  quizs:any;
 
   ngOnInit(): void {
    this.quizs = this.quizData.quiz;
  }
  constructor(
    private route:Router,
  ){}

  startQuiz(title:any){
    const queryParams : Params = { quiz : title}
    this.route.navigate(['/quizname'],{queryParams});
  }
  ngOnDestroy() {
    
  }
}
