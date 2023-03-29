import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userData: any;
  closeResult = '';

  constructor(
    public questionService: AuthenticationService,
    public modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.resultData();
    this.getData();
  }

  getData() {
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
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  ngOnDestroy(): void {}

  edit() {}
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
