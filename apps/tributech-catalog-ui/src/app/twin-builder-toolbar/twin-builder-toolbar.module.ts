import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { TrackByPropertyModule } from '@tributech/digital-twin';
import { TwinBuilderToolbarComponent } from './twin-builder-toolbar.component';

@NgModule({
  declarations: [TwinBuilderToolbarComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatTreeModule,
    TrackByPropertyModule,
  ],
  providers: [],
  exports: [TwinBuilderToolbarComponent],
})
export class TwinBuilderToolbarModule {}
