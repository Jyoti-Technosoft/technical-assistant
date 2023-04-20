import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DialogService } from '@app/dialog-service/dialog.service';
import Quill from 'quill';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AddQuizComponent implements OnInit, AfterViewInit {
  addNewForm = new FormGroup({
    quizName: new FormControl('', Validators.required),
    timer: new FormControl('', Validators.required),
    editor: new FormControl(),
    positivePoints: new FormControl('', Validators.required),
    negativePoints: new FormControl('', Validators.required),
    numberOfQuestions: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  constructor(
    private dialogService: DialogService,
    public activeModal: NgbActiveModal
  ) {}
  
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    let value = new Quill('#editor', {
      theme: 'snow',
    });
    value.on('text-change',((data)=>{
      this.addQuizFormValidator.editor.patchValue(document.getElementsByClassName('ql-editor')[0].innerHTML);         
    }))
  }
  
  openDialog() {
    console.log(this.addNewForm.value)
    this.dialogService.openAddQuestionDialog(
      this.addNewForm.value.numberOfQuestions
    );
  }

  get addQuizFormValidator() {
    return this.addNewForm.controls;
  }
}
