import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { FormlyModule } from '@ngx-formly/core';
import { DialogService } from '@tributech/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { SelfDescriptionFormService } from '../self-description-form.service';
import { SelfDescriptionFormComponent } from './self-description-form.component';

describe('InterfaceSelfDescriptionComponent', () => {
  let spectator: Spectator<SelfDescriptionFormComponent>;
  const createComponent = createComponentFactory({
    component: SelfDescriptionFormComponent,
    imports: [
      MockModule(FormlyModule),
      MockModule(MatButtonModule),
      FormsModule,
      ReactiveFormsModule,
    ],
    providers: [
      MockProvider(DialogService),
      MockProvider(SelfDescriptionFormService),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
