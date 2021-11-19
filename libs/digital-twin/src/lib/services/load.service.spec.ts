import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { DialogService } from '@tributech/core';
import { MockProvider } from 'ng-mocks';
import { ImportService } from './import.service';
import { LoadService } from './load.service';

describe('LoadService', () => {
  let spectator: SpectatorService<LoadService>;
  const createService = createServiceFactory({
    service: LoadService,
    providers: [MockProvider(ImportService), MockProvider(DialogService)],
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => (spectator = createService()));

  it('should create service', () => {
    expect(spectator.service).toBeTruthy();
  });
});
