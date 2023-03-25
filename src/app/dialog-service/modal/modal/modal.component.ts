import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {
  @Input() public label: any;
  @Input() public yesButtonLable: any;
  @Input() public NoButtonLable: any;

  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit() {}
}
