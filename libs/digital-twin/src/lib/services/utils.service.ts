import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private snackbar: MatSnackBar) {}

  copyToClipboard(content: any, stringify?: boolean) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    if (stringify) {
      selBox.value = JSON.stringify(content, null, 2);
    } else {
      selBox.value = content.toString();
    }
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openSnackBar('Copied to clipboard', 'close');
  }

  openSnackBar(message: string, action: string = 'close') {
    this.snackbar.open(message, action, {
      duration: 3000,
    });
  }
}
