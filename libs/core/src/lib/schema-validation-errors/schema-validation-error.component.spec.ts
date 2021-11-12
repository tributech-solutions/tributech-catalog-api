import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponents } from 'ng-mocks';
import { IconComponent } from '../icon/icon.component';
import { SchemaValidationErrorComponent } from './schema-validation-error.component';

describe('ValidationErrorsComponent', () => {
  let spectator: Spectator<SchemaValidationErrorComponent>;
  const createComponent = createComponentFactory({
    component: SchemaValidationErrorComponent,
    imports: [],
    declarations: [...MockComponents(IconComponent)],
  });
  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
