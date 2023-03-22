import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../dialog-service/modal/modal/modal.component';
import { QuestionService } from '../../service/question.service';
import { ToastService } from 'src/app/toast.service';
import dialogData from 'src/assets/json/dialogData.json';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  userData: any;
  dialogData = { ...dialogData };
  adminForm!: FormGroup;

  constructor(
    private route: Router,
    private questionService: QuestionService,
    private modalService: NgbModal,
    public toastService: ToastService,
    private fb: FormBuilder
  ) {}

  public formSubmitted(formValue: any) {
    let userdata = this.userData?.find(
      (value: any) =>
        value?.email == this.adminForm?.value?.email &&
        value?.password == this.adminForm?.value?.password
    );
    if (userdata) {
      this.toastService.showSuccessMessage('Login Successfully!');
      document.cookie = 'username' + '=' + userdata.id;
      localStorage.setItem('isAuthenticate', 'true');
      this.route.navigateByUrl('/dashboard');
    } else {
      this.toastService.showErrorMessage('Wrong Credential!');
    }
  }

  ngOnInit(): void {
    this.createForm();
    if (localStorage.getItem('registerUser')) {
      let data: any = localStorage.getItem('registerUser');
      this.userData = JSON.parse(data);
    }
  }

  createForm() {
    this.adminForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  ngOnDestroy(): void {}
}
