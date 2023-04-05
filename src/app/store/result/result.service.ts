import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ToastService } from '@app/toast.service';
import { TOAST_BG_COLOR } from '@app/shared/toast.enum';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(private toastService: ToastService) {}

  getResult(): Observable<any> {
    let allResult = JSON.parse(localStorage.getItem('result') as string).reverse();
    return of(allResult);
  }

  getResultFailed(message: any) {
    this.toastService.toastMessage(
      { label: message, icon: 'fa-solid fa-xmark' },
      TOAST_BG_COLOR.TOAST_ERROR_COLOR
    );
  }
}
