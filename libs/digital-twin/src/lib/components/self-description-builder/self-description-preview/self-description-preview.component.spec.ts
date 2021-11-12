import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { SelfDescriptionQuery } from '../../../services/store/self-description/self-description.query';
import { SelfDescriptionPreviewComponent } from './self-description-preview.component';

describe('SelfDescriptionPreviewComponent', () => {
  let spectator: Spectator<SelfDescriptionPreviewComponent>;
  const createComponent = createComponentFactory({
    component: SelfDescriptionPreviewComponent,
    imports: [],
    providers: [
      MockProvider(SelfDescriptionQuery, { selectDenormalized: () => EMPTY }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
