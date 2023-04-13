import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { addQuestion } from '@app/store/quiz/quiz.action';

@Component({
  selector: 'app-add-question-modal',
  templateUrl: './add-question-modal.component.html',
  styleUrls: ['./add-question-modal.component.scss']
})
export class AddQuestionModalComponent {

  addNewQuestionForm = new FormGroup({
    question: new FormControl('', Validators.required),
    option: new FormControl('',Validators.required),
    option1: new FormControl('',Validators.required),
    option2: new FormControl('',Validators.required),
    option3: new FormControl('',Validators.required),
    correctAnswer: new FormControl('',Validators.required)

  });
  
  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private store: Store,
    ) {}
  ngOnInit() {}

  get addQestionFormValidator() {
    return this.addNewQuestionForm.controls;
  }

  addQuestions(){
    debugger
    this.store.dispatch(addQuestion({question:this.addNewQuestionForm.value}))
  }
}
