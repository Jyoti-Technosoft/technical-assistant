import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '@app/dialog-service/dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Quill from 'quill';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss'],
})
export class AddQuizComponent implements OnInit, AfterViewInit {
  addNewForm = new FormGroup({
    quizName: new FormControl('', Validators.required),
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
  ngAfterViewInit(): void {
    let quill = new Quill('#editor', {
      theme: 'snow',
    });
  }
  ngOnInit(): void {}

  openDialog() {
    this.dialogService.openAddQuestionDialog(
      this.addNewForm.value.numberOfQuestions
    );
  }
  get addQuizFormValidator() {
    return this.addNewForm.controls;
  }
}
