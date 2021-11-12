import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { AuthService, TrackByPropertyModule } from '@tributech/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { TwinBuilderToolbarComponent } from './twin-builder-toolbar.component';

describe('TwinBuilderToolbarComponent', () => {
  let spectator: Spectator<TwinBuilderToolbarComponent>;
  const createComponent = createComponentFactory({
    component: TwinBuilderToolbarComponent,
    imports: [
      MockModule(MatSelectModule),
      MockModule(MatFormFieldModule),
      MockModule(MatToolbarModule),
      MockModule(MatButtonModule),
      MockModule(MatTreeModule),
      TrackByPropertyModule,
    ],
    providers: [MockProvider(AuthService)],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
