import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormExtensionsModule } from '../../wrappers/form-extensions.module';
import { PanelWrapperComponent } from '../../wrappers/panel-wrapper.component';
import { RepeatSectionComponent } from '../../wrappers/repeat-section.component';
import { SelfDescriptionFormComponent } from './self-description-form.component';

@NgModule({
  declarations: [SelfDescriptionFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forChild({
      wrappers: [{ name: 'panel', component: PanelWrapperComponent }],
      types: [{ name: 'repeat', component: RepeatSectionComponent }],
    }),
    FormlyMaterialModule,
    MatButtonModule,
    FormExtensionsModule,
  ],
  exports: [SelfDescriptionFormComponent],
})
export class SelfDescriptionFormModule {}
