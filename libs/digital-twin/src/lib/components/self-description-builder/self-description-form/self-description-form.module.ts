import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { PanelWrapperComponent } from '../../wrappers/panel-wrapper.component';
import { PanelWrapperModule } from '../../wrappers/panel-wrapper.module';
import { SelfDescriptionFormComponent } from './self-description-form.component';

@NgModule({
  declarations: [SelfDescriptionFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forChild({
      wrappers: [{ name: 'panel', component: PanelWrapperComponent }],
    }),
    FormlyMaterialModule,
    MatButtonModule,
    PanelWrapperModule,
  ],
  exports: [SelfDescriptionFormComponent],
})
export class SelfDescriptionFormModule {}
