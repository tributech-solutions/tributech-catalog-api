import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  createHostFactory,
  mockProvider,
  SpectatorHost,
} from '@ngneat/spectator/jest';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { createEmptyRelationship } from '@tributech/self-description';
import { MockModule } from 'ng-mocks';
import { ModelQuery } from '../../../services/store/model.query';
import { RelationshipService } from '../../../services/store/relationship.service';
import { TwinQuery } from '../../../services/store/twin.query';
import { RelationshipDataFormComponent } from './relationship-data-form.component';

describe('RelationshipDataFormComponent', () => {
  let spectator: SpectatorHost<RelationshipDataFormComponent>;
  const hostFactory = createHostFactory({
    component: RelationshipDataFormComponent,
    imports: [
      MockModule(FormlyModule),
      MockModule(FormlyMaterialModule),
      MockModule(MatButtonModule),
      FormsModule,
      ReactiveFormsModule,
    ],
    providers: [
      mockProvider(ModelQuery),
      mockProvider(TwinQuery),
      mockProvider(RelationshipService),
    ],
  });

  beforeEach(() => {
    spectator = hostFactory(
      `<tt-relationship-data-form [relationship]="relationship">
                </tt-relationship-data-form>`,
      {
        hostProps: {
          relationship: createEmptyRelationship(
            'testRel',
            'source1',
            'target1'
          ),
        },
      }
    );
  });

  it('should create component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should react to relationship change', () => {
    spyOn(spectator.component as any, 'setupForm').and.callThrough();
    spectator.setInput(
      'relationship',
      createEmptyRelationship('testRel1', 'source1', 'target1')
    );

    expect((spectator.component as any).setupForm).toHaveBeenCalledTimes(1);
  });
});
