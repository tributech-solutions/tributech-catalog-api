import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockProvider } from 'ng-mocks';
import { SelfDescriptionQuery } from '../../services/store/self-description/self-description.query';
import { SelfDescriptionFormService } from './self-description-form.service';

describe('SelfDescriptionFormService', () => {
  let spectator: SpectatorService<SelfDescriptionFormService>;
  const createService = createServiceFactory({
    service: SelfDescriptionFormService,
    providers: [MockProvider(SelfDescriptionQuery)],
  });

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
