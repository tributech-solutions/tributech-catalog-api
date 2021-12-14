import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RelationType, TwinInstance } from '@tributech/self-description';
import { map } from 'rxjs/operators';
import { RelationshipQuery } from '../relationship/relationship.query';
import { SelfDescriptionQuery } from '../self-description/self-description.query';
import { TwinState, TwinStore } from './twin.store';

@Injectable({ providedIn: 'root' })
export class TwinQuery extends QueryEntity<TwinState> {
  constructor(
    protected store: TwinStore,
    protected relationshipQuery: RelationshipQuery,
    protected selfDescriptionQuery: SelfDescriptionQuery
  ) {
    super(store);
  }

  treeData$ = this.selectAll({
    filterBy: (twin) =>
      this.relationshipQuery.getRelationshipsForTwin(
        twin?.$dtId,
        RelationType.Target
      ).length === 0,
  }).pipe(
    map((models) => models.map((m) => this.enrichTwin(m))),
    map((models) => [...models])
  );

  getChildren(parent: TwinInstance) {
    if (!parent) return [];

    const childrenRels = this.relationshipQuery.getRelationshipsForTwin(
      parent?.$dtId,
      RelationType.Source
    );
    const childrenIds = childrenRels?.map((t) => t?.$targetId);

    const childrenTwins = this.getAll({
      filterBy: (twin) => childrenIds.includes(twin?.$dtId),
    });

    const mapChildrenFields = [
      ...childrenTwins?.map((model) => this.enrichTwin(model)),
    ];
    return mapChildrenFields;
  }

  getTwinsByModelId(modelId: string) {
    return this.getAll({
      filterBy: (twin) => twin?.$metadata?.$model === modelId,
    });
  }

  getAllTwins() {
    return this.getAll();
  }

  getTwinById(twinId: string) {
    return this.getEntity(twinId);
  }

  private enrichTwin(instance: TwinInstance): TwinInstance {
    return {
      ...instance,
      hasChildren:
        this.relationshipQuery.getRelationshipsForTwin(
          instance?.$dtId,
          RelationType.Source
        ).length > 0,
      $modelMetadata: this.selfDescriptionQuery.getTwinGraphModel(
        instance?.$metadata?.$model
      ),
    };
  }
}
