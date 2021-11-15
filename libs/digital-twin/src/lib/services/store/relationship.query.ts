import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  filterRelType,
  RelationType,
  TwinRelationship,
} from '@tributech/self-description';
import { RelationshipState, RelationshipStore } from './relationship.store';

@Injectable({ providedIn: 'root' })
export class RelationshipQuery extends QueryEntity<RelationshipState> {
  constructor(protected store: RelationshipStore) {
    super(store);
  }

  getRelationshipsForTwin(
    twinId: string,
    relationshipType: RelationType = RelationType.All
  ) {
    return this.getAll({
      filterBy: (rel) => filterRelType(rel, twinId, relationshipType),
    });
  }

  filterRelationships(
    twinId: string,
    filterQuery: (relationship: TwinRelationship) => boolean
  ) {
    return this.getAll({
      filterBy: filterQuery,
    });
  }
}
