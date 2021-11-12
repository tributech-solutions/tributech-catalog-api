import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { TrackByPropertyModule } from '@tributech/core';
import { TwinTreeComponent } from './twin-tree.component';

@NgModule({
  declarations: [TwinTreeComponent],
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TrackByPropertyModule,
    MatToolbarModule,
  ],
  exports: [TwinTreeComponent],
})
export class TwinTreeModule {}
