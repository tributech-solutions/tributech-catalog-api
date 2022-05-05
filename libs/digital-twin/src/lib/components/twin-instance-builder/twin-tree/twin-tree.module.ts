import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TreeModule } from '@circlon/angular-tree-component';
import { TrackByPropertyModule } from '../../../other-components/track-by-propery/track-by-property.module';
import { TwinTreeComponent } from './twin-tree.component';

@NgModule({
  declarations: [TwinTreeComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TrackByPropertyModule,
    MatToolbarModule,
    TreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
  ],
  exports: [TwinTreeComponent],
})
export class TwinTreeModule {}
