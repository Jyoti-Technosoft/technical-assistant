import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ToastService } from '@app/component/toast/toast.service';
import { TOAST_BG_COLOR } from '@app/shared/toast.enum';
import { Result } from './result.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  resultUrl = "http://localhost:3000/results";
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private toastService: ToastService,
    private http: HttpClient
    ) {}

  getResult(): Observable<any> {
    return this.http.get(this.resultUrl);
  }

  addNewResult(currentData:Result): Observable<any> {
     return this.http.post(`${this.resultUrl}`, currentData);
  }

  failedResult(message: any) {
    this.toastService.toastMessage(
      { label: message, icon: 'fa-solid fa-xmark' },
      TOAST_BG_COLOR.TOAST_ERROR_COLOR
    );
  }
}
