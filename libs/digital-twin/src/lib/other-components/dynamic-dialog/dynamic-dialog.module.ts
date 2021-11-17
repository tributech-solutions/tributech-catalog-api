import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DynamicModule } from 'ng-dynamic-component';
import { LoadingModule } from '../loading/loading.module';
import { SchemaValidationErrorModule } from '../schema-validation-errors/schema-validation-error.module';
import { ValidationErrorModule } from '../validation-errors/validation-error.module';
import { DynamicDialogComponent } from './dynamic-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ValidationErrorModule,
    SchemaValidationErrorModule,
    MatDialogModule,
    DynamicModule,
    MatIconModule,
    LoadingModule,
  ],
  declarations: [DynamicDialogComponent],
  exports: [DynamicDialogComponent],
})
export class DynamicDialogModule {}
