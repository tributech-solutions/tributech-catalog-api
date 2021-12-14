import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TreeModule } from '@circlon/angular-tree-component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockModule, MockProvider } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { TrackByPropertyModule } from '../../../other-components/track-by-propery/track-by-property.module';
import { ExportService } from '../../../services/export.service';
import { LoadService } from '../../../services/load.service';
import { RelationshipQuery } from '../../../services/store/relationship/relationship.query';
import { SelfDescriptionQuery } from '../../../services/store/self-description/self-description.query';
import { TwinQuery } from '../../../services/store/twin-instance/twin.query';
import { TwinBuilderService } from '../twin-builder.service';
import { TwinTreeComponent } from './twin-tree.component';

describe('TwinTreeComponent', () => {
  let spectator: Spectator<TwinTreeComponent>;
  const createComponent = createComponentFactory({
    component: TwinTreeComponent,
    imports: [
      MockModule(TreeModule),
      MockModule(MatMenuModule),
      MockModule(MatFormFieldModule),
      MockModule(MatIconModule),
      MockModule(MatButtonModule),
      MockModule(MatTooltipModule),
      MockModule(MatToolbarModule),
      TrackByPropertyModule,
    ],
    providers: [
      MockProvider(TwinQuery, { treeData$: of([]) }),
      MockProvider(SelfDescriptionQuery),
      MockProvider(RelationshipQuery),
      MockProvider(TwinBuilderService, {
        twinGraphChanged$: EMPTY,
        expandAll$: EMPTY,
        collapseAll$: EMPTY,
      }),
      MockProvider(LoadService),
      MockProvider(ExportService),
    ],
  });
  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
