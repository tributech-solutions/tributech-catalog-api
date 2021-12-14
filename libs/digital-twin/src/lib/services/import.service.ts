import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { Interface, TwinGraph } from '@tributech/self-description';
import { RelationshipService } from './store/relationship/relationship.service';
import { SelfDescriptionService } from './store/self-description/self-description.service';
import { TwinService } from './store/twin-instance/twin.service';

@Injectable({ providedIn: 'root' })
export class ImportService {
  constructor(
    private selfDescriptionService: SelfDescriptionService,
    private twinService: TwinService,
    private relationshipService: RelationshipService
  ) {}

  importModels(models: Interface[]) {
    if (!models || models?.length === 0) {
      return;
    }
    this.selfDescriptionService.addInterfaces(models);
  }

  importInstances(twin: TwinGraph) {
    applyTransaction(() => {
      if (twin?.relationships?.length > 0) {
        this.relationshipService.addRelationships(twin?.relationships);
      }

      if (twin?.digitalTwins?.length > 0) {
        this.twinService.addTwins(twin?.digitalTwins);
      }
    });
  }
}
