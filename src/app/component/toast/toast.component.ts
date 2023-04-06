import { Component } from '@angular/core';

import { ToastService } from '@app/component/toast/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toast"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
        <span>
          <i class="fa-brands fa-{{ toast?.icon }} icon"></i>
        </span>
        <span>
          {{ toast?.textOrTpl }}
        </span>
    </ngb-toast>
  `,
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200',
  },
})
export class ToastComponent {
  constructor(public toastService: ToastService) {
  }
}
