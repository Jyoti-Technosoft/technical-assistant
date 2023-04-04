import { Injectable, TemplateRef } from '@angular/core';
import { toastMessage } from '../shared/shared.enum';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast: any[] = [];

  constructor() {}

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toast.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toast = this.toast.filter((t) => t !== toast);
  }

  showSuccessMessage(message: toastMessage) {
    this.show(message.label, {
      classname: 'bg-success text-light',
      delay: 10000,
    });
  }

  showErrorMessage(message: toastMessage) {
    this.show(message.label, {
      classname: 'bg-danger text-light',
      delay: 15000,
    });
  }
}
