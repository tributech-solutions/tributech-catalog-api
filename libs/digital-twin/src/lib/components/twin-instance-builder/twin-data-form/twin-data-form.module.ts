import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { PanelWrapperComponent } from '../../wrappers/panel-wrapper.component';
import { PanelWrapperModule } from '../../wrappers/panel-wrapper.module';
import { TwinDataFormComponent } from './twin-data-form.component';

@NgModule({
  declarations: [TwinDataFormComponent],
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
  exports: [TwinDataFormComponent],
})
export class TwinFormModule {}
