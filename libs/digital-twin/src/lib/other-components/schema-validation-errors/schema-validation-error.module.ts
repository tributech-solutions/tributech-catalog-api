import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SchemaValidationErrorComponent } from './schema-validation-error.component';

@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  declarations: [SchemaValidationErrorComponent],
  exports: [SchemaValidationErrorComponent],
})
export class SchemaValidationErrorModule {}
