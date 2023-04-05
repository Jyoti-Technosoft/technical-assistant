import { Component } from '@angular/core';

import { ToastService } from '../toast/toast.service';

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
        <i class="{{ toast?.textOrTpl?.icon }}"></i>
      </span>
      <span>
        {{ toast?.textOrTpl?.label }}
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
    console.log(this.toastService.toast);
  }
}
