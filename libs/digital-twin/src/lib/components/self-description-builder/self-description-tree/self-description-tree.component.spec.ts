import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TreeModule } from '@circlon/angular-tree-component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { UtilsService } from '@tributech/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { ExportService } from '../../../services/export.service';
import { SelfDescriptionQuery } from '../../../services/store/self-description/self-description.query';
import { SelfDescriptionService } from '../../../services/store/self-description/self-description.service';
import { SelfDescriptionFormService } from '../self-description-form.service';
import { SelfDescriptionTreeComponent } from './self-description-tree.component';

describe('SelfDescriptionTreeComponent', () => {
  let spectator: Spectator<SelfDescriptionTreeComponent>;
  const createComponent = createComponentFactory({
    component: SelfDescriptionTreeComponent,
    imports: [
      MockModule(MatToolbarModule),
      MockModule(MatButtonModule),
      MockModule(MatIconModule),
      MockModule(MatFormFieldModule),
      MockModule(TreeModule),
      MockModule(MatMenuModule),
    ],
    declarations: [],
    providers: [
      MockProvider(SelfDescriptionQuery, { treeData$: of([]) }),
      MockProvider(SelfDescriptionFormService),
      MockProvider(SelfDescriptionService),
      MockProvider(UtilsService),
      MockProvider(ExportService),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
