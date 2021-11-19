import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AngularSplitModule } from 'angular-split';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { SelfDescriptionService } from '../../services/store/self-description/self-description.service';
import { SelfDescriptionBuilderComponent } from './self-description-builder.component';
import { SelfDescriptionFormComponent } from './self-description-form/self-description-form.component';
import { SelfDescriptionPreviewComponent } from './self-description-preview/self-description-preview.component';
import { SelfDescriptionTreeComponent } from './self-description-tree/self-description-tree.component';

describe('SelfDescriptionBuilderComponent', () => {
  let spectator: Spectator<SelfDescriptionBuilderComponent>;
  const createComponent = createComponentFactory({
    component: SelfDescriptionBuilderComponent,
    imports: [
      RouterTestingModule,
      MockModule(AngularSplitModule),
      MockModule(MatButtonModule),
      MockModule(MatIconModule),
    ],
    providers: [MockProvider(SelfDescriptionService)],
    declarations: [
      MockComponent(SelfDescriptionTreeComponent),
      MockComponent(SelfDescriptionFormComponent),
      MockComponent(SelfDescriptionPreviewComponent),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
