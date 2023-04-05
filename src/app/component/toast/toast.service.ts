import { Injectable, TemplateRef } from '@angular/core';
import { toastMessage } from '@app/shared/toast.enum';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast: any[] = [];

  constructor() {}

  show(textOrTpl: any | TemplateRef<any>, options: any = {}) {
    console.log(this.toast);
    this.toast.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toast = this.toast.filter((t) => t !== toast);
  }

  toastMessage(message: toastMessage, className: string) {
    this.show(message, {
      classname: className,
      delay: 15000,
    });
  }
}
