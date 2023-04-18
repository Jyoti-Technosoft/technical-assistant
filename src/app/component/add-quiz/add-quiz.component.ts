import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '@app/dialog-service/dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent {
  addNewForm = new FormGroup({
    quizName: new FormControl('', Validators.required),
    // rules: new FormControl('',Validators.required),
    timer: new FormControl('', Validators.required),
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

  ngOninit(): void {}
  openDialog() {
    this.dialogService.openAddQuestionDialog(
      this.addNewForm.value.numberOfQuestions
    );
  }

  // quill = new Quill('#editor', {
  //   theme: 'snow',
  // });

  get addQuizFormValidator() {
    return this.addNewForm.controls;
  }
}
