import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from './modal/modal/modal.component';
import { AddQuestionModalComponent } from './modal/modal/add-question-modal/add-question-modal.component';
import { AddQuizComponent } from '@app/component/add-quiz/add-quiz.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private modalService: NgbModal) {}

  openDialog(configData: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(ModalComponent, { centered: true  });
      modalRef.componentInstance.configData = configData;
      modalRef.result.then((data) => {
        resolve(<boolean>data);
      });
    });
  }
  
  openAddQuizDialog(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(AddQuizComponent, { centered: true  });
      modalRef.result.then((data) => {
        resolve(<boolean>data);
      });
    });
  }

  openAddQuestionDialog(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(AddQuestionModalComponent, { centered: true  });
      modalRef.result.then((data) => {
        resolve(<boolean>data);
      });
    });
  }

  hasModelOpen() {
    return this.modalService.hasOpenModals();
  }

  destroy() {
    this.modalService.dismissAll(false);
  }
}
