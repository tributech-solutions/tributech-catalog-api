import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormlyModule } from '@ngx-formly/core';
import { PanelWrapperComponent } from './panel-wrapper.component';
import { RepeatSectionComponent } from './repeat-section.component';

@NgModule({
  declarations: [PanelWrapperComponent, RepeatSectionComponent],
  imports: [CommonModule, FormlyModule, MatButtonModule],
  exports: [PanelWrapperComponent, RepeatSectionComponent],
})
export class FormExtensionsModule {}
