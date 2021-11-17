import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularSplitModule } from 'angular-split';
import { TrackByPropertyModule } from '../../other-components/track-by-propery/track-by-property.module';
import { SelfDescriptionBuilderComponent } from './self-description-builder.component';
import { SelfDescriptionFormModule } from './self-description-form/self-description-form.module';
import { SelfDescriptionPreviewComponent } from './self-description-preview/self-description-preview.component';
import { SelfDescriptionTreeModule } from './self-description-tree/self-description-tree.module';

@NgModule({
  declarations: [
    SelfDescriptionBuilderComponent,
    SelfDescriptionPreviewComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TrackByPropertyModule,
    MatToolbarModule,
    SelfDescriptionTreeModule,
    AngularSplitModule,
    SelfDescriptionFormModule,
  ],
  exports: [SelfDescriptionBuilderComponent],
})
export class SelfDescriptionBuilderModule {}
