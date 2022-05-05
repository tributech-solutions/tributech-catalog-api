import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule, MockProvider } from 'ng-mocks';
import { TwinJsonModalComponent } from './twin-json-modal.component';

describe('TwinJsonModalComponent', () => {
  let spectator: Spectator<TwinJsonModalComponent>;
  const createComponent = createComponentFactory({
    component: TwinJsonModalComponent,
    providers: [
      MockProvider(MatDialogRef),
      { provide: MAT_DIALOG_DATA, useValue: {} },
    ],
    imports: [
      MockModule(MatFormFieldModule),
      MockModule(MatDialogModule),
      MockModule(MatButtonModule),
      MockModule(MatInputModule),
      FormsModule,
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
