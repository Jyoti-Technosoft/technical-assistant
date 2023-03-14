import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal/modal.component';
import dialogData from '../../assets/json/dialogData.json';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  adminform: any;

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
        .then((data) => {
          resolve(<boolean>data);
        })
        .catch((data) => {
          resolve(<boolean>data);
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
