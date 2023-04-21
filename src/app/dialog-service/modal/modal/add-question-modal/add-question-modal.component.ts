import { Component, Input, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-question-modal',
  templateUrl: './add-question-modal.component.html',
  styleUrls: ['./add-question-modal.component.scss'],
})
export class AddQuestionModalComponent {
  questions: any[] = [];
  @Input('configData') configData: any;
  @Input('configData2') configData2: any;
  @Input('formGroup') formGroup!: FormGroup;
  @ViewChild('carousel')
  carousel!: NgbCarousel;
  questionIndex: number = 0;
  options: any[] = [];

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit() {
    for (let i = 0; i < this.configData; i++) {
      this.questions.push(this.createForm());
    }
    for (let i = 0; i < this.configData2; i++) {
      this.options.push(this.createForm());
    }
  }

  createForm() {
    const formArray = this.formGroup.controls['questions'] as FormArray;
    const newfield = this.fb.group({
      question: this.fb.control('', Validators.required),
      options: this.fb.array([]),
      answer: this.fb.group({
        id: this.fb.control('',Validators.required)
      }),
    })
    const options = newfield.controls['options'] as FormArray;
    
    for (let i = 0; i < this.configData2; i++) {
      options.push(
        this.fb.group({
          id:i+1,
          label: this.fb.control('',Validators.required)
        })
      );
    }
     formArray.push(newfield);

    return formArray;
  }

  get addQuestionFormValidator() {
    return this.formGroup.get('questions') as FormArray;
  }

  previousQuestion(questionIndex: number) {
    this.questionIndex = questionIndex - 1;
    this.carousel.prev();
  }
  nextQuestion(questionIndex: number) {
    this.questionIndex = questionIndex + 1;
    if (this.questionIndex != this.questions.length) {
      this.carousel.next();
    }
  }
}
