import { Component, Input, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-question-modal',
  templateUrl: './add-question-modal.component.html',
  styleUrls: ['./add-question-modal.component.scss']
})
export class AddQuestionModalComponent {
  question:any [] = [];
  addNewQuestionForm!:FormGroup;
  @Input('configData') configData:any;
  @ViewChild('carousel')
  carousel!: NgbCarousel;
  questionIndex: number = 0 ;

  constructor(public activeModal: NgbActiveModal,private fb: FormBuilder) {
      this.addNewQuestionForm = this.fb.group({
        form: this.fb.array([]),
      });
  }
  ngOnInit() {
    for (let i = 0; i < this.configData; i++) {
      this.question.push(this.createForm());
    }
  }

  createForm() {
    const formArray = this.addNewQuestionForm.controls['form'] as FormArray;
     return formArray.push(
      this.fb.group({
        question: this.fb.control('',Validators.required),
        option: this.fb.control('',Validators.required),
        option1: this.fb.control('',Validators.required),
        option2: this.fb.control('',Validators.required),
        option3: this.fb.control('',Validators.required),
        correctAnswer: this.fb.control('',Validators.required)
      })
    ); 
  }

  get addQuestionFormValidator() {
    return this.addNewQuestionForm.get('form') as FormArray;
  }

  previousQuestion(questionIndex: number) {
    this.questionIndex = questionIndex - 1;
    this.carousel.prev();
  }
  nextQuestion(questionIndex:number){
    this.questionIndex = questionIndex + 1;
    if (this.questionIndex != this.question.length) {
      this.carousel.next();
    }
  }
  
}
