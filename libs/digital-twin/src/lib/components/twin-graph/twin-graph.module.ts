import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { ResizeObserverModule } from '@ng-web-apis/resize-observer';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { TrackByPropertyModule } from '../../other-components/track-by-propery/track-by-property.module';
import { TwinGraphComponent } from './twin-graph.component';

@NgModule({
  declarations: [TwinGraphComponent],
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TrackByPropertyModule,
    NgxGraphModule,
    ResizeObserverModule,
  ],
  exports: [TwinGraphComponent],
})
export class TwinGraphModule {}
