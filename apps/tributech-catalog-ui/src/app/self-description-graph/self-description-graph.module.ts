import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TwinGraphModule } from '@tributech/digital-twin';
import { SelfDescriptionGraphComponent } from './self-description-graph.component';

@NgModule({
  imports: [CommonModule, TwinGraphModule],
  declarations: [SelfDescriptionGraphComponent],
})
export class SelfDescriptionGraphModule {}
