import { MatChipsModule } from '@angular/material/chips';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ManageModelsService } from '@tributech/catalog-api';
import { TableModule } from '@tributech/digital-twin';
import { MockModule, MockProvider } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { HeroHeaderModule } from '../shared/hero-header/hero-header.module';
import { ModelOverviewComponent } from './model-overview.component';

describe('ModelOverviewComponent', () => {
  let spectator: Spectator<ModelOverviewComponent>;
  const createComponent = createComponentFactory({
    component: ModelOverviewComponent,
    providers: [
      MockProvider(ManageModelsService, { getAllEntities: () => EMPTY }),
    ],
    imports: [
      RouterTestingModule,
      MockModule(HeroHeaderModule),
      MockModule(TableModule),
      MockModule(MatChipsModule),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
