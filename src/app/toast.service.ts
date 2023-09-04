import { Injectable, TemplateRef } from '@angular/core';

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

  toastMessage(message: any, className:string) {
    this.show(message?.label, {
      classname: className,
      delay: 5000,
      icon: message?.icon
    });
  }
}
