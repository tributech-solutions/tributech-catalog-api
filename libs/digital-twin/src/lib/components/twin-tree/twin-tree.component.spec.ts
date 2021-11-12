import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TrackByPropertyModule } from '@tributech/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { LoadService } from '../../services/load.service';
import { ModelQuery } from '../../services/store/model.query';
import { ModelService } from '../../services/store/model.service';
import { RelationshipQuery } from '../../services/store/relationship.query';
import { RelationshipService } from '../../services/store/relationship.service';
import { TwinQuery } from '../../services/store/twin.query';
import { TwinService } from '../../services/store/twin.service';
import { TwinBuilderService } from '../twin-instance-builder/twin-builder.service';
import { TwinTreeComponent } from './twin-tree.component';

describe('TwinTreeComponent', () => {
  let spectator: Spectator<TwinTreeComponent>;
  const createComponent = createComponentFactory({
    component: TwinTreeComponent,
    imports: [
      MockModule(MatTreeModule),
      MockModule(MatMenuModule),
      MockModule(MatIconModule),
      MockModule(MatButtonModule),
      MockModule(MatTooltipModule),
      MockModule(MatToolbarModule),
      TrackByPropertyModule,
    ],
    providers: [
      MockProvider(TwinQuery, {
        selectEntityAction: () => EMPTY,
        getTwinsAsTreeWithMetadata: () => [],
      }),
      MockProvider(ModelQuery),
      MockProvider(RelationshipQuery),
      MockProvider(RelationshipService),
      MockProvider(TwinService),
      MockProvider(ModelService),
      MockProvider(LoadService),
      MockProvider(TwinBuilderService, { twinGraphChanged$: EMPTY }),
    ],
  });
  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
