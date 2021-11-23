import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  createHostFactory,
  mockProvider,
  SpectatorHost,
} from '@ngneat/spectator/jest';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { createEmptyTwin } from '@tributech/self-description';
import { MockModule } from 'ng-mocks';
import { ModelQuery } from '../../../services/store/model.query';
import { TwinService } from '../../../services/store/twin.service';
import { TwinDataFormComponent } from './twin-data-form.component';

describe('TwinDataFormComponent', () => {
  let spectator: SpectatorHost<TwinDataFormComponent>;
  const hostFactory = createHostFactory({
    component: TwinDataFormComponent,
    imports: [
      MockModule(FormlyModule),
      MockModule(FormlyMaterialModule),
      MockModule(MatButtonModule),
      FormsModule,
      ReactiveFormsModule,
    ],
    providers: [mockProvider(ModelQuery), mockProvider(TwinService)],
  });

  beforeEach(() => {
    spectator = hostFactory(
      `<tt-twin-data-form [twin]="twinInstance"></tt-twin-data-form>`,
      {
        hostProps: {
          twinInstance: createEmptyTwin('dtmi:io:example:test;1'),
        },
      }
    );
  });

  it('should create component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should react to twin change', () => {
    spyOn(spectator.component as any, 'setupForm').and.callThrough();
    spectator.setInput('twin', createEmptyTwin('dtmi:io:example:test1;1'));

    expect((spectator.component as any).setupForm).toHaveBeenCalledTimes(1);
  });
});
