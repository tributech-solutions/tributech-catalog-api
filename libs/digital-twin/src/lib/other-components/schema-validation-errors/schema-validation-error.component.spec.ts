import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockModule } from 'ng-mocks';
import { SchemaValidationErrorComponent } from './schema-validation-error.component';

describe('ValidationErrorsComponent', () => {
  let spectator: Spectator<SchemaValidationErrorComponent>;
  const createComponent = createComponentFactory({
    component: SchemaValidationErrorComponent,
    imports: [MockModule(FontAwesomeModule)],
    declarations: [],
  });
  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
