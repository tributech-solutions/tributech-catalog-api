import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponents } from 'ng-mocks';
import { IconComponent } from '../icon/icon.component';
import { ValidationErrorComponent } from './validation-error.component';

describe('ValidationErrorsComponent', () => {
  let spectator: Spectator<ValidationErrorComponent>;
  const createComponent = createComponentFactory({
    component: ValidationErrorComponent,
    imports: [],
    declarations: [...MockComponents(IconComponent)],
  });
  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
