import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import quizData from '../../../assets/json/data.json';

@Component({
  selector: 'app-carddesign',
  templateUrl: './startquiz.component.html',
  styleUrls: ['./startquiz.component.scss']
})
export class StartquizComponent implements OnInit {
  quizData = { ...quizData };
  instruction: any;
  selectedQuizType!: string;
  
  constructor(private route: Router, private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.mapJsonData();
  }

  mapJsonData() {
    this.selectedQuizType = this.activeRoute.snapshot.queryParams['quiz'];
    this.instruction = this.quizData?.quiz?.find(
      (data) => data?.quizId == this.selectedQuizType
    );
  }

  quiz() {
    const selectedQuiz = this.activeRoute.snapshot.queryParams['quiz'];
    const queryParams: Params = { quiz: selectedQuiz };

    this.route.navigate(['/quiz'], { queryParams });
  }
}
