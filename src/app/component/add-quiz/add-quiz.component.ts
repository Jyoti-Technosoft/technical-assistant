import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogService } from '@app/dialog-service/dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { addQuiz } from '@app/store/quiz/quiz.action';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss'],
})
export class AddQuizComponent {
  closeResult = '';
  addNewForm = this.fb.group({
    quizId: this.fb.control('', Validators.required),
    rules: this.fb.control('', Validators.required),
    image: this.fb.control('', Validators.required),
    timer: this.fb.control('', Validators.required),
    positivePoints: this.fb.control('', Validators.required),
    negativePoints: this.fb.control('', Validators.required),
    title: this.fb.control('', Validators.required),
    numberOfQuestions : this.fb.control('', Validators.required),
    numberOfOptions : this.fb.control('', Validators.required),
    description: this.fb.control('', Validators.required),
    questions: this.fb.array([]),
  });

  constructor(
    private dialogService: DialogService,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOninit(): void {
  }
  openDialog() {
    this.dialogService.openAddQuestionDialog(
      this.addNewForm.value.numberOfQuestions,
      this.addNewForm.value.numberOfOptions,
      this.addNewForm
    );
  }

  saveQuiz() {
    debugger
    this.store.dispatch(addQuiz({ quiz: this.addNewForm.value }));
  }

  get addQuizFormValidator() {
    return this.addNewForm.controls;
  }
}
