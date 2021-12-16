import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'tt-repeat-section',
  template: ` <h3 class="card-header">{{ to.label }}</h3>
    <div *ngFor="let _field of field.fieldGroup; let i = index" class="row">
      <formly-field class="col" [field]="_field"></formly-field>
    </div>
    <div style="margin:30px 0;">
      <button mat-raised-button (click)="add()">Add</button>
    </div>`,
  styles: [
    `
      .row {
        display: flex;
        flex-direction: row;
        margin-left: 2rem;
      }
    `,
  ],
})
export class RepeatSectionComponent extends FieldArrayType {}
