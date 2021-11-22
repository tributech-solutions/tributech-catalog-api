import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TreeModule } from '@circlon/angular-tree-component';
import { TrackByPropertyModule } from '../../../other-components/track-by-propery/track-by-property.module';
import { SelfDescriptionTreeComponent } from './self-description-tree.component';

@NgModule({
  declarations: [SelfDescriptionTreeComponent],
  imports: [
    CommonModule,
    TreeModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TrackByPropertyModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  exports: [SelfDescriptionTreeComponent],
})
export class SelfDescriptionTreeModule {}
