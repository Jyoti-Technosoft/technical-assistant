import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ToastService } from '@app/toast.service';
import { TOAST_BG_COLOR } from '@app/shared/toast.enum';
import { Result } from './result.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  result = "http://localhost:3000/results";
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private toastService: ToastService,
    private http: HttpClient
    ) {}

  getResult(): Observable<any> {
    let allResult = JSON.parse(localStorage.getItem('result') as string).reverse();
    return of(allResult);
  }

  addNewResult(currentData:Result): Observable<any> {
     let data: any = localStorage.getItem('result')
      ? localStorage.getItem('result')
      : [];
    let stringifyData = data.length == 0 ? data : JSON.parse(data);
     stringifyData.push(currentData);
     console.log(stringifyData)
     return this.http.post(`${this.result}`, data);
  }

  failedResult(message: any) {
    this.toastService.toastMessage(
      { label: message, icon: 'fa-solid fa-xmark' },
      TOAST_BG_COLOR.TOAST_ERROR_COLOR
    );
  }
}
