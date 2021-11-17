import { Component, Input } from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { SchemaValidationError } from '@tributech/catalog-api';

@Component({
  selector: 'tt-schema-validation-error',
  templateUrl: './schema-validation-error.component.html',
  styleUrls: ['./schema-validation-error.component.scss'],
})
export class SchemaValidationErrorComponent {
  faAlert = faExclamationTriangle;
  @Input() error: SchemaValidationError;
}
