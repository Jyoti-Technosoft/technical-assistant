import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { QuestionService } from 'src/app/service/question.service';
import quizData from '../../../assets/json/data.json';

@Component({
  selector: 'app-carddesign',
  templateUrl: './startquiz.component.html',
  styleUrls: ['./startquiz.component.scss']
})
export class StartquizComponent implements OnInit {
  quizData:any = quizData;
  rules: any;
  selectedQuizType: any;
  constructor(
    private route:Router,
    private activeRoute: ActivatedRoute,
    public questionService: QuestionService
  ){}


  ngOnInit(): void {
    this.mapJSONData();
  }

  mapJSONData() {
    if (this.questionService.selectedQuizType) {
      this.selectedQuizType = this.questionService.selectedQuizType;
    }
   this.rules = this.quizData[this.selectedQuizType]?.rules;
  }


  quiz(){
    const selectedQuiz = this.activeRoute.snapshot.queryParams['quiz'];
    const queryParams: Params = { quiz:selectedQuiz} ;

    this.route.navigate(['/quiz'],{queryParams});
  }
}
