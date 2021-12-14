import { Injectable } from '@angular/core';
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
    if (!twin?.digitalTwins || twin?.digitalTwins.length === 0) {
      return;
    }
    if (!twin?.relationships && twin?.relationships?.length === 0) {
      return;
    }

    this.twinService.addTwins(twin?.digitalTwins);
    this.relationshipService.addRelationships(twin?.relationships);
  }
}
