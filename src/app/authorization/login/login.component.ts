import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { DialogService } from 'src/app/dialog-service/dialog.service';
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
  adminForm!:FormGroup;

  constructor(
    private route: Router,
    private dialogService: DialogService,
    private fb:FormBuilder,
    public toastService: ToastService
  ) {}

  public formSubmitted() {
    debugger
    console.log(this.adminForm)
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
    } else {
      let label = this.dialogData.loginModel.label;
      let yesButtonLable = this.dialogData.loginModel.yesButtonLable;
      let NoButtonLable = this.dialogData.loginModel.NoButtonLable;
      this.dialogService
        .openDialog(label, yesButtonLable, NoButtonLable)
        .then((value) => {
          if (value) {
            this.route.navigateByUrl('registration');
          } else {
            this.adminForm?.reset();
          }
        });
    }
  }

  ngOnInit(): void {
    if (!localStorage.getItem('registeruser')?.length) {
      let registeruser: any = localStorage.getItem('registeruser');
      registeruser = JSON.parse(registeruser as string);
      } else {
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
