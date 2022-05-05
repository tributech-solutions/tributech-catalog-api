import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SelfDescriptionGraphModule } from '@tributech/digital-twin';
import { MockModule } from 'ng-mocks';
import { SelfDescriptionGraphComponent } from './self-description-graph.component';

describe('SelfDescriptionGraphComponent', () => {
  let spectator: Spectator<SelfDescriptionGraphComponent>;
  const createComponent = createComponentFactory({
    component: SelfDescriptionGraphComponent,
    imports: [MockModule(SelfDescriptionGraphModule)],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
