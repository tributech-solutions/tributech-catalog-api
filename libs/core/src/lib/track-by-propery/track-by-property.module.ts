import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackByPropertyPipe } from './track-by-property.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [TrackByPropertyPipe],
  exports: [TrackByPropertyPipe],
})
export class TrackByPropertyModule {}
