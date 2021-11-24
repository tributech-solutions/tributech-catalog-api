import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ManageModelsService } from '@tributech/catalog-api';
import { TwinsService } from '@tributech/twin-api';
import { AngularSplitModule } from 'angular-split';
import { MockModule } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { DialogService } from '../../other-components/dynamic-dialog/dialog.service';
import { TrackByPropertyModule } from '../../other-components/track-by-propery/track-by-property.module';
import { LoadService } from '../../services/load.service';
import { TwinQuery } from '../../services/store/twin.query';
import { TwinService } from '../../services/store/twin.service';
import { TwinGraphModule } from '../twin-graph/twin-graph.module';
import { RelationshipFormModule } from './relationship-data-form/relationship-data-form.module';
import { OFFLINE_MODE } from './twin-builder.settings';
import { TwinFormModule } from './twin-data-form/twin-data-form.module';
import { TwinInstanceBuilderComponent } from './twin-instance-builder.component';
import { TwinTreeModule } from './twin-tree/twin-tree.module';

describe('TwinInstanceBuilderComponent', () => {
  let spectator: Spectator<TwinInstanceBuilderComponent>;
  const createComponent = createComponentFactory({
    component: TwinInstanceBuilderComponent,
    imports: [
      RouterTestingModule,
      HttpClientModule,
      MockModule(TwinFormModule),
      MockModule(RelationshipFormModule),
      MockModule(MatButtonModule),
      MockModule(TwinTreeModule),
      MockModule(TwinGraphModule),
      MockModule(AngularSplitModule),
      MockModule(MatIconModule),
      MockModule(TrackByPropertyModule),
    ],
    providers: [
      mockProvider(ManageModelsService, {
        getAllEntities: () => EMPTY,
      }),
      mockProvider(LoadService, {
        loadRemoteBaseModels: () => Promise.resolve(),
      }),
      {
        provide: OFFLINE_MODE,
        useValue: true,
      },
    ],
    mocks: [TwinService, TwinsService, TwinQuery, DialogService],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
