import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'tt-twin-json-modal',
  templateUrl: './twin-json-modal.component.html',
  styleUrls: ['./twin-json-modal.component.scss'],
})
export class TwinJsonModalComponent {
  twinString = '';
  constructor(
    public dialogRef: MatDialogRef<TwinJsonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  abort(): void {
    this.dialogRef.close();
  }
}
