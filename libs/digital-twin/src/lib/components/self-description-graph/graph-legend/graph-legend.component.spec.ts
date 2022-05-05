import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';
import { TrackByPropertyModule } from '../../../other-components/track-by-propery/track-by-property.module';
import { GraphLegendComponent } from './graph-legend.component';

describe('TwinGraphComponent', () => {
  let spectator: Spectator<GraphLegendComponent>;
  const createComponent = createComponentFactory({
    component: GraphLegendComponent,
    imports: [
      MockModule(MatExpansionModule),
      MockModule(TrackByPropertyModule),
      MockModule(MatListModule),
    ],
    providers: [],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
