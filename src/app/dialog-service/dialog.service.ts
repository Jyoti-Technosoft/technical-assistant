import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from './modal/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  adminform: any;
  
  constructor(
    private modalService:NgbModal,
  
  ) {}

  openDialog(configData:any):Promise<boolean>{
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.configData = configData ;
      
      modalRef.result.then((data) => {
        resolve(<boolean> data)
      }); 
    })
  }
    
 }
