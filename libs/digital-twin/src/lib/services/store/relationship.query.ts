import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RelationType } from '../../models/constants';
import { BasicRelationship } from '../../models/data.model';
import { filterRelType } from '../../utils/utils';
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
    filterQuery: (relationship: BasicRelationship) => boolean
  ) {
    return this.getAll({
      filterBy: filterQuery,
    });
  }
}
