import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { ResizeObserverModule } from '@ng-web-apis/resize-observer';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { MockComponent, MockModule } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { DialogService } from '../../other-components/dynamic-dialog/dialog.service';
import { TrackByPropertyModule } from '../../other-components/track-by-propery/track-by-property.module';
import { SelfDescriptionQuery } from '../../services/store/self-description/self-description.query';
import { GraphLegendComponent } from './graph-legend/graph-legend.component';
import { SelfDescriptionGraphComponent } from './self-description-graph.component';

describe('SelfDescriptionGraphComponent', () => {
  let spectator: Spectator<SelfDescriptionGraphComponent>;
  const createComponent = createComponentFactory({
    component: SelfDescriptionGraphComponent,
    imports: [
      MockModule(MatTreeModule),
      MockModule(MatIconModule),
      MockModule(MatButtonModule),
      MockModule(MatMenuModule),
      MockModule(MatTooltipModule),
      MockModule(TrackByPropertyModule),
      MockModule(NgxGraphModule),
      MockModule(ResizeObserverModule),
    ],
    providers: [
      mockProvider(SelfDescriptionQuery, {
        selectAll: () => EMPTY,
      }),
      mockProvider(DialogService),
    ],
    declarations: [MockComponent(GraphLegendComponent)],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
