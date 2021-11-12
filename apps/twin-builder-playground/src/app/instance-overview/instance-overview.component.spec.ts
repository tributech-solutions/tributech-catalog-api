import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { HeroHeaderModule, TableModule } from '@tributech/core';
import { TwinBuilderService } from '@tributech/digital-twin';
import { TwinsService } from '@tributech/twin-api';
import { MockModule, MockProvider } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { InstanceOverviewComponent } from './instance-overview.component';

describe('InstanceOverviewComponent', () => {
  let spectator: Spectator<InstanceOverviewComponent>;
  const createComponent = createComponentFactory({
    component: InstanceOverviewComponent,
    imports: [
      MockModule(TableModule),
      MockModule(HeroHeaderModule),
      RouterTestingModule,
    ],
    providers: [
      MockProvider(TwinsService, { getAllTwins: () => EMPTY }),
      MockProvider(TwinBuilderService),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
