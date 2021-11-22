import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelfDescriptionGraphModule as LibSelfDescriptionGraphModule } from '@tributech/digital-twin';
import { SelfDescriptionGraphComponent } from './self-description-graph.component';

@NgModule({
  imports: [CommonModule, LibSelfDescriptionGraphModule],
  declarations: [SelfDescriptionGraphComponent],
})
export class SelfDescriptionGraphModule {}
