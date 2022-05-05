import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TwinRelationship } from '@tributech/self-description';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RelationshipState
  extends EntityState<TwinRelationship, string> {}

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
