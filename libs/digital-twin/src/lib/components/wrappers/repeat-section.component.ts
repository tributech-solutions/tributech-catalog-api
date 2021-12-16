import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'tt-repeat-section',
  template: ` <h3 class="card-header">{{ to?.label }}</h3>
    <div *ngFor="let _field of field.fieldGroup; let i = index" class="group">
      <formly-field class="col" [field]="_field"></formly-field>
      <div>
        <button mat-raised-button color="warn" (click)="remove(i)">
          Remove
        </button>
      </div>
    </div>
    <div style="margin:30px 0;">
      <button mat-raised-button (click)="add()">Add</button>
    </div>`,
  styles: [
    `
      :host {
        display: block;
        background-color: white;
        padding: 1rem;
        margin-bottom: 1rem;
      }
      .group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class RepeatSectionComponent extends FieldArrayType {}
