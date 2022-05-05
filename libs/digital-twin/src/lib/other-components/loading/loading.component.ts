import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'tt-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  @Input() message: string;
  @Input() subtitle: string;
  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; subtitle: string }
  ) {}
}
