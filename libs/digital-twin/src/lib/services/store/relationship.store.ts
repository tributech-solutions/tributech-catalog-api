import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BasicRelationship } from '../../models/data.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RelationshipState
  extends EntityState<BasicRelationship, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'Relationship',
  idKey: '$relationshipId',
  resettable: true,
})
export class RelationshipStore extends EntityStore<RelationshipState> {
  constructor() {
    super();
  }
}
