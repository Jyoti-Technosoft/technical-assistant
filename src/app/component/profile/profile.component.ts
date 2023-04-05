import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  dataSource: any;
  userData: any;
  closeResult = '';
  registrationForm: any;
  currentIndex: any;

  constructor(
    public questionService: AuthenticationService,
    public modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.resultData();
    this.getData();
  }

  getData() {
    console.log(this.questionService.getUser());
    console.log(JSON.parse(localStorage.getItem('registerUser') as string));
    let data: any = localStorage.getItem('registerUser');
    this.userData = JSON.parse(data).find((data: any) => {
      return data.id == this.questionService.getUser();
    });
  }

  resultData() {
    let data: any = localStorage.getItem('result');
  }

  initialLetter(userName: string) {
    const intials = userName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
    return intials;
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then();
  }

  ngOnDestroy(): void {}

  Update() {
    let data = JSON.parse(localStorage.getItem('registerUser') as string);
    const updatedData = data?.map((value: any) => {
      if (value?.id == this.userData?.id) {
        data = this.userData;
      }
      return data;
    });
    localStorage.setItem('registerUser', JSON.stringify(updatedData));
  }
}
