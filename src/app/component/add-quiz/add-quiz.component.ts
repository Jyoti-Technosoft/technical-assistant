import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '@app/dialog-service/dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { addQuiz } from '@app/store/quiz/quiz.action';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent {
  closeResult = '';
  quizUrl = "http://localhost:3000/quiz";
  addNewForm = new FormGroup({
    quizId: new FormControl('', Validators.required),
    rules: new FormControl('',Validators.required),
    image: new FormControl('',Validators.required),
    timer: new FormControl('',Validators.required),
    positivePoints: new FormControl('',Validators.required),
    negativePoints: new FormControl('',Validators.required),
    numberOfQuestions: new FormControl('',Validators.required),
    title: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required) 

  });

  constructor(
    private dialogService:DialogService,
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private store:Store
    ){}

  ngOninit(): void {
  }
  openDialog() {
    this.dialogService.openAddQuestionDialog()
  }
  

  saveQuiz(){
    this.store.dispatch(addQuiz({quiz:this.addNewForm.value}))
  }

  get addQuizFormValidator() {
    return this.addNewForm.controls;
  }
}


