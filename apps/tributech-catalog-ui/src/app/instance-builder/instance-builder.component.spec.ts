import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  LoadService,
  TwinInstanceBuilderModule,
} from '@tributech/digital-twin';
import { MockModule, MockProvider } from 'ng-mocks';
import { InstanceBuilderComponent } from './instance-builder.component';

describe('InstanceBuilderComponent', () => {
  let spectator: Spectator<InstanceBuilderComponent>;
  const createComponent = createComponentFactory({
    component: InstanceBuilderComponent,
    providers: [MockProvider(LoadService)],
    imports: [MockModule(TwinInstanceBuilderModule)],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
