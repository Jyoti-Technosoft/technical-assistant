import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal/modal.component';
import dialogData from '../../assets/json/dialogData.json';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DialogService {

  constructor(private modalService: NgbModal, private route: Router) {}

  dialogData = { ...dialogData };

  openDialog(
    label: string,
    yesButtonLable: string,
    NoButtonLable: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.label = label;
      modalRef.componentInstance.yesButtonLable = yesButtonLable;
      modalRef.componentInstance.NoButtonLable = NoButtonLable;

      modalRef.result
        .then((answer) => {
          resolve(<boolean>answer);
        })
        .catch((answer) => {
          resolve(<boolean>answer);
        });
    });
  }

  destroy() {
    this.modalService.dismissAll(false);
  }

  hasModelOpen() {
    return this.modalService.hasOpenModals();
  }
}
