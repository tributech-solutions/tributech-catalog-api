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
import { MockModule, MockProvider } from 'ng-mocks';
import { ConfigService } from '../config/config.service';
import { TrackByPropertyModule } from '../track-by-propery/track-by-property.module';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let spectator: Spectator<TableComponent>;
  const createComponent = createComponentFactory({
    component: TableComponent,
    declarations: [],
    imports: [
      NoopAnimationsModule,
      MockModule(MatTableModule),
      MockModule(MatIconModule),
      MockModule(MatCheckboxModule),
      MockModule(MatSortModule),
      MockModule(MatPaginatorModule),
      MockModule(TrackByPropertyModule),
      MockModule(MatButtonModule),
      MockModule(MatMenuModule),
      MockModule(FontAwesomeModule),
      MockModule(RouterModule),
    ],
    providers: [MockProvider(ConfigService)],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
