import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { DtdlModelsService } from '@tributech/catalog-api';
import {
  TwinBuilderService,
  TwinInstanceTableModule,
} from '@tributech/digital-twin';
import { TwinsService } from '@tributech/twin-api';
import { MockModule } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { HeroHeaderModule } from '../../shared/hero-header/hero-header.module';
import { TwinModelDetailComponent } from './twin-model-detail.component';

describe('TwinModelDetailComponent', () => {
  let spectator: Spectator<TwinModelDetailComponent>;
  const createComponent = createComponentFactory({
    component: TwinModelDetailComponent,
    imports: [
      RouterTestingModule,
      HttpClientModule,
      MockModule(HeroHeaderModule),
      MockModule(TwinInstanceTableModule),
    ],
    providers: [
      mockProvider(DtdlModelsService, {
        getExpanded: () => EMPTY,
      }),
      mockProvider(TwinsService, {
        getTwinsByModelId: () => EMPTY,
      }),
      mockProvider(TwinBuilderService),
    ],
    mocks: [],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
