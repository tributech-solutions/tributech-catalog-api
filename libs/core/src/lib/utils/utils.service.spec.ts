import { MatSnackBarModule } from '@angular/material/snack-bar';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let spectator: SpectatorService<UtilsService>;
  const createService = createServiceFactory({
    service: UtilsService,
    imports: [MatSnackBarModule],
  });

  beforeEach(() => (spectator = createService()));

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });
});
