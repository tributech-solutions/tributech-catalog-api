import {
  Component,
  Inject,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DynamicDialogConfig<T> {
  component: Type<T>;
  inputs?: { [key: string]: unknown };
  disableClose?: boolean;
}

@Component({
  selector: 'tt-dynamic-dialog',
  templateUrl: './dynamic-dialog.component.html',
  styleUrls: ['./dynamic-dialog.component.scss'],
})
export class DynamicDialogComponent<T> implements OnInit {
  @ViewChild('target', { read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;

  constructor(
    private dialogRef: MatDialogRef<DynamicDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: DynamicDialogConfig<T>
  ) {}

  ngOnInit() {
    if (this.data.disableClose) {
      this.dialogRef.disableClose = true;
    }
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
