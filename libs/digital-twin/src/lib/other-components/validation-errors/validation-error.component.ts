import { Component, Input } from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tt-validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.scss'],
})
export class ValidationErrorComponent {
  faAlert = faExclamationTriangle;
  @Input() error: string;
}
