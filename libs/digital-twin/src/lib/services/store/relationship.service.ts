import { Injectable } from '@angular/core';
import { OrArray } from '@datorama/akita';
import { RelationType } from '../../models/constants';
import { BasicRelationship } from '../../models/data.model';
import { createETag, filterRelType } from '../../utils/utils';
import { RelationshipStore } from './relationship.store';

@Injectable({ providedIn: 'root' })
export class RelationshipService {
  constructor(private relationshipStore: RelationshipStore) {}

  addRelationships(relationship: OrArray<BasicRelationship>) {
    this.relationshipStore.add(relationship, { loading: false });
  }

  updateRelationship(relationship: Partial<BasicRelationship>) {
    const updatePatch = { ...relationship };
    updatePatch.$etag = createETag();
    this.relationshipStore.upsert(relationship?.$relationshipId, updatePatch);
  }

  deleteRelationship(relationshipId: string) {
    console.log(`Deleting relationship ${relationshipId}`);
    this.relationshipStore.remove(relationshipId);
  }

  deleteTwinRelationships(
    twinId: string,
    relationType: RelationType = RelationType.All
  ) {
    this.relationshipStore.remove((rel: BasicRelationship) => {
      return filterRelType(rel, twinId, relationType);
    });
  }
}
