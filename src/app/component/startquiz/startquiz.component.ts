import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';


import { getAllQuiz, selectQuiz } from '@app/store/quiz/quiz.action';
import { getallQuiz, quizState } from '@app/store/quiz/quiz.state';
import quizData from '@assets/json/data.json';
import { State, Store } from '@ngrx/store';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-carddesign',
  templateUrl: './startquiz.component.html',
  styleUrls: ['./startquiz.component.scss'],
})
export class StartquizComponent implements OnInit {
  quizData = { ...quizData };
  instruction: any;
  selectedQuizType!: string;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private store: Store,
    private state: State<quizState>
  ) {}

  ngOnInit(): void {
    if(!this.state.getValue().quiz.allQuiz) {
      this.store.dispatch(getAllQuiz())
    }
    this.getInstruction();
  }

  getInstruction() {
    this.selectedQuizType = this.activeRoute.snapshot.queryParams['quiz'];
    this.store
      .select((state: any) => state.quiz)
      .pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.instruction = data?.selectedQuiz;
      });
      if(!this.instruction) {
         this.store.dispatch(selectQuiz({quizId:this.selectedQuizType}))
      }
  }

  quiz() {
    const selectedQuiz = this.activeRoute.snapshot.queryParams['quiz'];
    const queryParams: Params = { quiz: selectedQuiz };

    this.route.navigate(['/quiz'], { queryParams });
  }
}
