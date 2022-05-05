import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResizeObserverModule } from '@ng-web-apis/resize-observer';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { MockModule } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { TrackByPropertyModule } from '../../other-components/track-by-propery/track-by-property.module';
import { RelationshipQuery } from '../../services/store/relationship/relationship.query';
import { TwinQuery } from '../../services/store/twin-instance/twin.query';
import { TwinGraphComponent } from './twin-graph.component';

describe('TwinGraphComponent', () => {
  let spectator: Spectator<TwinGraphComponent>;
  const createComponent = createComponentFactory({
    component: TwinGraphComponent,
    imports: [
      MockModule(MatIconModule),
      MockModule(MatButtonModule),
      MockModule(MatMenuModule),
      MockModule(MatTooltipModule),
      MockModule(TrackByPropertyModule),
      MockModule(NgxGraphModule),
      MockModule(ResizeObserverModule),
    ],
    providers: [
      mockProvider(TwinQuery, {
        selectAll: () => EMPTY,
      }),
      mockProvider(RelationshipQuery, {
        selectAll: () => EMPTY,
      }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
