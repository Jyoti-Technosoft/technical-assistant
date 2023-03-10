import { Component,OnDestroy,OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import quizData from '../../../assets/json/data.json';
import { QuestionService } from '../../service/question.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnDestroy {
  quizData = quizData;
  title: any;
  arrayIndex=0;
  image: any;
  description: any;
  QuizType:any = [0,1,2];
 
  // images = ["assets\\html-css1.png","assets\\javascript.jpg","assets\\react-js.png","assets\\html-css1.png","assets\\javascript.jpg","assets\\react-js.png","assets\\html-css1.png","assets\\javascript.jpg","assets\\react-js.png","assets\\html-css1.png","assets\\javascript.jpg","assets\\react-js.png"];
  //  subject = ["HTML-CSS Quiz","JavaScript Quiz","React JS Quiz","HTML-CSS Quiz","JavaScript Quiz","React JS Quiz","HTML-CSS Quiz","JavaScript Quiz","React JS Quiz","HTML-CSS Quiz","JavaScript Quiz","React JS Quiz"];
  //  descriptions = ["HTML (the Hypertext Markup Language) and CSS (Cascading Style Sheets) are two of the core technologies for building Web pages.","JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.","React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta."];
  //  imagesindex=0;
  //  imagessindex=1;
  //  imagesssindex=2;

    
   
   ngOnInit(): void {
    console.log(this.quizData.QuizType)
    this.QuizType = this.quizData?.QuizType;

    // this.mapJSONData();
  }
  constructor(
    private route:Router,
    public questionService: QuestionService,
  ){}
  
  mapJSONData(){
    // this.title = this.quizData?.QuizType?.title;
    // this.image = this.quizData?.QuizType;
    // this.description = this.quizData?.QuizType;
    // console.log("title",this.title)
    // console.log("image",this.image)
    // console.log("description",this.description)
  }
  // next(){
  //   this.imagesindex++;
  //   this.imagessindex++;
  //   this.imagesssindex++;
  // }
  quizname(title:any){
    console.log(title);
    this.questionService.selectedQuizType = title;
    const queryParams : Params = { quiz : title}
    this.route.navigate(['/quizname'],{queryParams});
  }
  ngOnDestroy() {
    
  }
}
