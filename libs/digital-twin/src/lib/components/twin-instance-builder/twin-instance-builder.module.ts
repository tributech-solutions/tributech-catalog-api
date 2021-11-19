import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TrackByPropertyModule } from '@tributech/core';
import { AngularSplitModule } from 'angular-split';
import { RelationshipFormModule } from '../relationship-data-form/relationship-data-form.module';
import { TwinFormModule } from '../twin-data-form/twin-data-form.module';
import { TwinGraphModule } from '../twin-graph/twin-graph.module';
import { TwinTreeModule } from '../twin-tree/twin-tree.module';
import { TwinInstanceBuilderComponent } from './twin-instance-builder.component';

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TwinFormModule,
    RelationshipFormModule,
    TwinTreeModule,
    TrackByPropertyModule,
    TwinGraphModule,
    MatButtonModule,
    MatIconModule,
    AngularSplitModule,
  ],
  declarations: [TwinInstanceBuilderComponent],
  exports: [TwinInstanceBuilderComponent],
})
export class TwinInstanceBuilderModule {}
