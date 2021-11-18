import { Injectable } from '@angular/core';
import { HashMap, QueryEntity } from '@datorama/akita';
import {
  ExpandedInterface,
  RelationType,
  TwinInstance,
} from '@tributech/self-description';
import { cloneDeep } from 'lodash';
import { ModelQuery } from './model.query';
import { RelationshipQuery } from './relationship.query';
import { TwinState, TwinStore } from './twin.store';

export interface TwinTreeNode extends TwinInstance {
  children?: TwinTreeNode[];
}

export interface EnrichedTwinTreeNode extends TwinTreeNode {
  modelMetadata$?: ExpandedInterface;
}

@Injectable({ providedIn: 'root' })
export class TwinQuery extends QueryEntity<TwinState> {
  constructor(
    protected store: TwinStore,
    protected relationshipQuery: RelationshipQuery,
    protected modelQuery: ModelQuery
  ) {
    super(store);
  }

  get twins() {
    return this.getAll();
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

  getTwinsAsTree() {
    const hashMap: HashMap<TwinTreeNode> = cloneDeep(
      this.getAll({ asObject: true })
    );

    Object.keys(hashMap).forEach(
      (twinId) => (hashMap[twinId] = { ...hashMap[twinId], children: [] })
    );

    const dataTree: TwinTreeNode[] = [];
    Object.entries(hashMap).forEach(([twinId, twin]) => {
      const relationships = this.relationshipQuery.getRelationshipsForTwin(
        twinId,
        RelationType.Target
      );
      if (relationships.length > 0) {
        relationships.forEach((rel) => {
          hashMap[rel?.$sourceId].children.push(hashMap[rel?.$targetId]);
        });
      } else {
        dataTree.push(hashMap[twinId]);
      }
    });
    return dataTree;
  }

  getTwinsAsTreeWithMetadata() {
    const hashMap: HashMap<EnrichedTwinTreeNode> = cloneDeep(
      this.getAll({ asObject: true })
    );

    Object.keys(hashMap).forEach(
      (twinId) =>
        (hashMap[twinId] = {
          ...hashMap[twinId],
          children: [],
          modelMetadata$: this.modelQuery.getTwinGraphModel(
            hashMap[twinId]?.$metadata?.$model
          ),
        })
    );

    const dataTree: EnrichedTwinTreeNode[] = [];
    Object.entries(hashMap).forEach(([twinId, twin]) => {
      const relationships = this.relationshipQuery.getRelationshipsForTwin(
        twinId,
        RelationType.Target
      );
      if (relationships.length > 0) {
        relationships.forEach((rel) => {
          hashMap[rel?.$sourceId].children.push(hashMap[rel?.$targetId]);
        });
      } else {
        dataTree.push(hashMap[twinId]);
      }
    });
    return dataTree;
  }
}
