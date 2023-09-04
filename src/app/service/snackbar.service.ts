import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  config:any = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'end'
  };

  constructor(private snackBar: MatSnackBar) { }

  info(message: string): void {
    this.config['panelClass'] = ['info-snackbar'];
    this.openSnackBar(message);
  }

  error(message: string): void {
    this.config['panelClass'] = ['error-snackbar'];
    this.openSnackBar(message);
  }

  success(message: string): void {
    this.config['panelClass'] = ['success-snackbar'];
    this.openSnackBar(message);
  }

  openSnackBar(mess: string): void {
    this.snackBar.open(mess, 'Ok', this.config);
  }
}
