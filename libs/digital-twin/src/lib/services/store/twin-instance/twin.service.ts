import { Injectable } from '@angular/core';
import { isArray, OrArray } from '@datorama/akita';
import { createETag, TwinInstance } from '@tributech/self-description';
import { RelationshipService } from '../relationship/relationship.service';
import { RelationshipStore } from '../relationship/relationship.store';
import { TwinStore } from './twin.store';

@Injectable({ providedIn: 'root' })
export class TwinService {
  constructor(
    private twinStore: TwinStore,
    private relationshipStore: RelationshipStore,
    private relationshipService: RelationshipService
  ) {}

  addTwins(twin: OrArray<TwinInstance>) {
    this.twinStore.upsertMany(isArray(twin) ? twin : [twin], {
      loading: false,
    });
  }

  updateTwin(twinId: string, patch: Partial<TwinInstance>) {
    const updatePatch = { ...patch };
    updatePatch.$etag = createETag();
    return this.twinStore.upsert(twinId, updatePatch);
  }

  deleteTwin(twinId: string, skipRelationships = false) {
    if (!skipRelationships) {
      this.relationshipService.deleteTwinRelationships(twinId);
    }

    this.twinStore.remove(twinId);
  }

  deleteAllTwins() {
    this.twinStore.reset();
    this.relationshipStore.reset();
  }
}
