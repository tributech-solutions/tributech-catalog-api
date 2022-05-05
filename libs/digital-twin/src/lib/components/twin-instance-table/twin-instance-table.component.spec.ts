import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { DtdlModelsService } from '@tributech/catalog-api';
import { QueryService, TwinsService } from '@tributech/twin-api';
import { MockModule } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { TableModule } from '../../other-components/table/table.module';
import { TwinInstanceTableComponent } from './twin-instance-table.component';

describe('TwinInstanceTableComponent', () => {
  let spectator: Spectator<TwinInstanceTableComponent>;
  const createComponent = createComponentFactory({
    component: TwinInstanceTableComponent,
    imports: [RouterTestingModule, MockModule(TableModule)],
    providers: [
      mockProvider(DtdlModelsService, {
        getExpanded: () => EMPTY,
      }),
      mockProvider(TwinsService, {
        getTwinsByModelId: () => EMPTY,
      }),
      mockProvider(QueryService, {
        getTwinGraphByCypherQuery: () => EMPTY,
      }),
    ],
    mocks: [],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
