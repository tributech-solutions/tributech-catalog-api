import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ConfigService } from '@tributech/core';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { DateFnsModule } from 'ngx-date-fns';
import { FilterModule } from '../filter/filter.module';
import { TrackByPropertyModule } from '../track-by-propery/track-by-property.module';
import { DateCellComponent } from './cells/date-cell/date-cell.component';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let spectator: Spectator<TableComponent>;
  const createComponent = createComponentFactory({
    component: TableComponent,
    declarations: [MockComponent(DateCellComponent)],
    imports: [
      NoopAnimationsModule,
      MockModule(MatTableModule),
      MockModule(MatIconModule),
      MockModule(MatCheckboxModule),
      MockModule(MatSortModule),
      MockModule(MatPaginatorModule),
      MockModule(TrackByPropertyModule),
      MockModule(FilterModule),
      MockModule(MatButtonModule),
      MockModule(MatMenuModule),
      MockModule(FontAwesomeModule),
      MockModule(DateFnsModule),
      MockModule(RouterModule),
    ],
    providers: [MockProvider(ConfigService)],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
