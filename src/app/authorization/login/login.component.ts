import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from '../../dialog-service/modal/modal/modal.component';

import { QuestionService } from '../../service/question.service';
import { DialogService } from 'src/app/dialog-service/dialog.service';
import { ToastService } from 'src/app/toast.service';

import dialogData from 'src/assets/json/dialogData.json';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  userData: any;
  dialogData = { ...dialogData };
  adminForm!:FormGroup;

  constructor(
    private route: Router,
    private questionService: QuestionService,
    private modalService: NgbModal,
    private dialogService: DialogService,
    private fb:FormBuilder,
    public toastService: ToastService
  ) {}

  public formSubmitted() {
    console.log(this.adminForm)
    let userdata = this.userData?.find(
      (value: any) => value?.email ==  this.adminForm?.value?.email && value?.pwd ==  this.adminForm?.value?.password
    );
    if (
      userdata
      ) {
      document.cookie = "username" + "=" + userdata.id;
      localStorage.setItem('isAuthenticate', 'true');
      this.route.navigateByUrl('/dashboard');
    } 
    else {
      let label = this.dialogData.loginModel.label;
      let yesButtonLable = this.dialogData.loginModel.yesButtonLable;
      let NoButtonLable = this.dialogData.loginModel.NoButtonLable;
      this.dialogService
        .openDialog(label, yesButtonLable, NoButtonLable)
        .then((value) => {
          if (value) {
            this.route.navigateByUrl('userregistration');
          } 
          else {
           this.toastService.show('Wrong Credential',{ classname: 'bg-danger text-light',delay:10000 })
          }
        });
    }
  }

  ngOnInit(): void {
    if (!localStorage.getItem('registeruser')?.length) {
      let registeruser: any = localStorage.getItem('registeruser');
      registeruser = JSON.parse(registeruser as string);
      // alert('There is no user create one');
      } 
      else {
      let data: any = localStorage.getItem('registeruser');
      this.userData = JSON.parse(data);
    }
    this.createForm();
  }
  // Toast message
  showSuccess(){
    this.toastService.show('Login Successfully',{ classname: 'bg-success text-light', delay:10000})
  }

  createForm() {
     this.adminForm = this.fb.group({
      email : [''],
      password : ['']
     })
  }


  ngOnDestroy(): void {
  }

}
