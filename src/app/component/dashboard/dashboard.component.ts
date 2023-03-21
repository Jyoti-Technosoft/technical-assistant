import { Component,OnDestroy,OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import quizData from '../../../assets/json/data.json';
import { QuestionService } from '../../service/question.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,OnDestroy {
  quizData = quizData;
  title: any;
  arrayIndex=0;
  image: any;
  description: any;
  QuizType:any = [0,1,2];

   ngOnInit(): void {
    this.QuizType = this.quizData?.QuizType;

  }
  constructor(
    private route:Router,
    public questionService: QuestionService,
  ){}



  quizname(title:any){
    this.questionService.selectedQuizType = title;
    const queryParams : Params = { quiz : title}
    this.route.navigate(['/quizname'],{queryParams});
  }

  ngOnDestroy() {
    
  }
}
