import { Injectable } from '@angular/core';
import { isArray, OrArray } from '@datorama/akita';
import {
  createETag,
  filterRelType,
  RelationType,
  TwinRelationship,
} from '@tributech/self-description';
import { RelationshipStore } from './relationship.store';

@Injectable({ providedIn: 'root' })
export class RelationshipService {
  constructor(private relationshipStore: RelationshipStore) {}

  addRelationships(relationship: OrArray<TwinRelationship>) {
    this.relationshipStore.upsertMany(
      isArray(relationship) ? relationship : [relationship],
      {
        loading: false,
      }
    );
  }

  updateRelationship(relationship: Partial<TwinRelationship>) {
    const updatePatch = { ...relationship };
    updatePatch.$etag = createETag();
    this.relationshipStore.upsert(relationship?.$relationshipId, updatePatch);
  }

  deleteRelationship(relationshipId: string) {
    this.relationshipStore.remove(relationshipId);
  }

  deleteTwinRelationships(
    twinId: string,
    relationType: RelationType = RelationType.All
  ) {
    this.relationshipStore.remove((rel: TwinRelationship) => {
      return filterRelType(rel, twinId, relationType);
    });
  }
}
