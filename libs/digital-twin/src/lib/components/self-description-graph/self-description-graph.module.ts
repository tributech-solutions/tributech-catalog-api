import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResizeObserverModule } from '@ng-web-apis/resize-observer';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { TrackByPropertyModule } from '../../other-components/track-by-propery/track-by-property.module';
import { GraphLegendComponent } from './graph-legend/graph-legend.component';
import { SelfDescriptionGraphComponent } from './self-description-graph.component';

@NgModule({
  declarations: [SelfDescriptionGraphComponent, GraphLegendComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TrackByPropertyModule,
    NgxGraphModule,
    ResizeObserverModule,
    MatListModule,
    MatExpansionModule,
  ],
  exports: [SelfDescriptionGraphComponent],
})
export class SelfDescriptionGraphModule {}
