import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'tt-wrapper-panel',
  template: `
    <div class="card">
      <h3 class="card-header">{{ to.label }}</h3>
      <div class="card-body">
        <ng-container #fieldComponent></ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./panel-wrapper.component.scss'],
})
export class PanelWrapperComponent extends FieldWrapper {}
