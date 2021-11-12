import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PanelWrapperComponent } from './panel-wrapper.component';

@NgModule({
  declarations: [PanelWrapperComponent],
  imports: [CommonModule],
  exports: [PanelWrapperComponent],
})
export class PanelWrapperModule {}
