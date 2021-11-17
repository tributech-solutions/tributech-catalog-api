import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockModule } from 'ng-mocks';
import { ValidationErrorComponent } from './validation-error.component';

describe('ValidationErrorsComponent', () => {
  let spectator: Spectator<ValidationErrorComponent>;
  const createComponent = createComponentFactory({
    component: ValidationErrorComponent,
    imports: [MockModule(FontAwesomeModule)],
    declarations: [],
  });
  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
