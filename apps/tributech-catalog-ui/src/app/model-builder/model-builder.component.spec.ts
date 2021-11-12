import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SelfDescriptionBuilderModule } from '@tributech/digital-twin';
import { MockModule } from 'ng-mocks';
import { ModelBuilderComponent } from './model-builder.component';

describe('ModelBuilderComponent', () => {
  let spectator: Spectator<ModelBuilderComponent>;
  const createComponent = createComponentFactory({
    component: ModelBuilderComponent,
    imports: [MockModule(SelfDescriptionBuilderModule)],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
