import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import quizData from '@assets/json/data.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  quizData = { ...quizData };
  quizs: any;
  
  constructor(private route: Router) {}

  ngOnInit(): void {
    this.quizs = this.quizData.quiz;
  }

  startQuiz(title: string) {
    const queryParams: Params = { quiz: title };
    this.route.navigate(['/quizname'], { queryParams });
  }

  ngOnDestroy() {}

}
