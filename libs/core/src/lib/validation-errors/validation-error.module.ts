import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ValidationErrorComponent } from './validation-error.component';

@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  declarations: [ValidationErrorComponent],
  exports: [ValidationErrorComponent],
})
export class ValidationErrorModule {}
