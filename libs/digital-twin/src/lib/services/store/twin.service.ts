import { Injectable } from '@angular/core';
import { isArray, OrArray } from '@datorama/akita';
import { DigitalTwin } from '@tributech/twin-api';
import { createETag } from '../../utils/utils';
import { RelationshipService } from './relationship.service';
import { RelationshipStore } from './relationship.store';
import { TwinStore } from './twin.store';

@Injectable({ providedIn: 'root' })
export class TwinService {
  constructor(
    private twinStore: TwinStore,
    private relationshipStore: RelationshipStore,
    private relationshipService: RelationshipService
  ) {}

  addTwins(twin: OrArray<DigitalTwin>) {
    this.twinStore.upsertMany(isArray(twin) ? twin : [twin], {
      loading: false,
    });
  }

  updateTwin(twinId: string, patch: Partial<DigitalTwin>) {
    const updatePatch = { ...patch };
    updatePatch.$etag = createETag();
    return this.twinStore.upsert(twinId, updatePatch);
  }

  deleteTwin(twinId: string, skipRelationships = false) {
    if (!skipRelationships) {
      this.relationshipService.deleteTwinRelationships(twinId);
    }

    console.log(`Deleting twin ${twinId}`);
    this.twinStore.remove(twinId);
  }

  deleteAllTwins() {
    this.twinStore.reset();
    this.relationshipStore.reset();
  }
}
