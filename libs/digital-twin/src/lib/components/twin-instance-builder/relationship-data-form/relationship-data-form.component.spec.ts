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
import { RelationshipService } from '../../../services/store/relationship/relationship.service';
import { SelfDescriptionQuery } from '../../../services/store/self-description/self-description.query';
import { TwinQuery } from '../../../services/store/twin-instance/twin.query';
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
      mockProvider(SelfDescriptionQuery),
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
