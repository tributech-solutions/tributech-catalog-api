import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';
import { DialogService } from './dialog.service';

describe('DialogServiceService', () => {
  let spectator: SpectatorService<DialogService>;
  const createService = createServiceFactory({
    service: DialogService,
    providers: [MockProvider(MatDialog), MockProvider(MatSnackBar)],
  });

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
