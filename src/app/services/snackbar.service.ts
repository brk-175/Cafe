import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    if (action == 'error') {
      this.snackBar.open(message, '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 2000,
        panelClass: ['red-snackbar'],
      });
    } else if (action == 'warn') {
      this.snackBar.open(message, '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 2000,
        panelClass: ['yellow-snackbar'],
      });
    } else {
      this.snackBar.open(message, '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 2000,
        panelClass: ['green-snackbar'],
      });
    }
  }
}
