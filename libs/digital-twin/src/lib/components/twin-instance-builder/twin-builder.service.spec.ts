import { Router } from '@angular/router';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import {
  RelationshipsService as RelationshipAPIService,
  TwinsService,
} from '@tributech/twin-api';
import { DialogService } from '../../other-components/dynamic-dialog/dialog.service';
import { LoadService } from '../../services/load.service';
import { RelationshipQuery } from '../../services/store/relationship/relationship.query';
import { RelationshipService } from '../../services/store/relationship/relationship.service';
import { SelfDescriptionService } from '../../services/store/self-description/self-description.service';
import { TwinQuery } from '../../services/store/twin-instance/twin.query';
import { TwinService } from '../../services/store/twin-instance/twin.service';
import { TwinBuilderService } from './twin-builder.service';
import { OFFLINE_MODE } from './twin-builder.settings';

describe('TwinBuilderService', () => {
  let spectator: SpectatorService<TwinBuilderService>;
  const createService = createServiceFactory({
    service: TwinBuilderService,
    providers: [
      {
        provide: OFFLINE_MODE,
        useValue: true,
      },
      mockProvider(LoadService),
      mockProvider(TwinService),
      mockProvider(TwinsService),
      mockProvider(TwinQuery),
      mockProvider(RelationshipQuery),
      mockProvider(Router),
      mockProvider(DialogService),
      mockProvider(RelationshipAPIService),
      mockProvider(RelationshipService),
      mockProvider(SelfDescriptionService),
    ],
  });

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
