import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Injectable, Logger } from '@nestjs/common';
import { to } from 'await-to-js';
import { JsonldGraph } from 'jsonld-graph';
import { forEach, isArray, isString } from 'lodash';
import { ModelEntity } from '../models/db-model';
import { context } from '../models/json-ld-context';
import { ExpandedInterface, Interface } from '../models/models';
import {
  expandInterface,
  getChildrenVertices,
  hasNoIncomingRelationships,
  REL_TARGET_ANY,
} from '../utils/model.utils';

export class InterfaceWithChildren extends Interface {
  children: InterfaceWithChildren[];
}

export class InterfaceHashTree {
  [dtmi: string]: InterfaceWithChildren;
}

@Injectable()
export class ModelGraphService {
  private modelGraph: JsonldGraph;
  private readonly logger = new Logger(ModelGraphService.name);

  constructor(private modelStore: InMemoryDBService<ModelEntity>) {
    this.initialize();
  }

  getExpanded(modelId: string): ExpandedInterface {
    this.logger.verbose(`Get expanded model for ${modelId}`);
    const model = this.modelGraph.getVertex(modelId);
    return expandInterface(model);
  }

  getExpandedWithParents(modelId: string): ExpandedInterface[] {
    this.logger.verbose(`Get expanded model with parents for ${modelId}`);

    const vertices: ExpandedInterface[] = [];
    const vertex = this.modelGraph.getVertex(modelId);

    if (!vertex) return [];

    vertices.push(expandInterface(vertex));

    if (!vertex?.hasIncoming('dtmi:dtdl:property:extends;2')) {
      return vertices;
    }

    vertices.push(
      ...getChildrenVertices(vertex).map((v) => expandInterface(v))
    );

    return vertices;
  }

  getAllExpanded(): ExpandedInterface[] {
    this.logger.verbose(`Get all expanded models`);

    const models = this.modelGraph
      .getVertices()
      .filter((x) => x.isType('dtmi:dtdl:class:Interface;2'))
      .items();
    Logger.log(models?.length);

    return models.map((model) => expandInterface(model));
  }

  getRoots(): ExpandedInterface[] {
    this.logger.verbose(`Get all root models`);

    const models = this.modelGraph
      .getVertices()
      .filter((x) => x.isType('dtmi:dtdl:class:Interface;2'))
      .items();

    const roots = models.filter((x) => hasNoIncomingRelationships(x));
    return roots.map((m) => expandInterface(m));
  }

  getRootsWithChildren(): InterfaceWithChildren[] {
    this.logger.verbose(`Get all root models with children`);

    const hashMap: InterfaceHashTree = {};
    const models = this.modelStore.getAll().map((m) => m?.model);

    forEach(models, (m: InterfaceWithChildren) => {
      hashMap[m?.['@id']] = { ...m, children: [] };
    });

    const dataTree: InterfaceWithChildren[] = [];

    forEach(hashMap, (model) => {
      if (!model?.extends) {
        dataTree.push(model);
      } else if (isString(model?.extends)) {
        hashMap[model?.extends].children.push(model);
      } else if (isArray(model?.extends)) {
        forEach(model?.extends, (m) => {
          // TODO: If nested Interface we need to handle it differently
          hashMap[m as string].children.push(model);
        });
      }
    });

    return dataTree;
  }

  getInvolvedRelationships(sourceModelId: string, targetModelId?: string) {
    this.logger.verbose(
      `Get involved relationships ${sourceModelId} --> ${targetModelId}`
    );

    const sourceModel = this.getExpanded(sourceModelId);
    if (!sourceModel) {
      throw new Error(`Model with ${sourceModelId} not found!`);
    }

    if (targetModelId) {
      const targetModel = this.getExpanded(targetModelId);
      if (!targetModel) {
        throw new Error(`Model with ${targetModelId} not found!`);
      }

      return sourceModel.relationships.filter(
        (x) =>
          x.target === REL_TARGET_ANY ||
          x.target === targetModelId ||
          targetModel.bases.some((y) => y === x.target)
      );
    }
    return sourceModel?.relationships || [];
  }

  private initialize() {
    if (!this.modelGraph) {
      const models = this.modelStore.getAll();
      // Load contexts/vocabulary
      this.modelGraph = new JsonldGraph();
      this.modelGraph.addContext('dtmi:dtdl:context;2', context);

      if (models.length > 0) {
        this.loadModelsIntoGraph(models.map((m) => m?.model));
      }
    }
  }

  async loadModelsIntoGraph(models: Interface[]) {
    Logger.log(`Loading ${models?.length} models into graph...`);
    const [error, success] = await to(this.modelGraph.parse(models));
    if (error) {
      Logger.error(error);
      return Promise.reject(error);
    }
    Logger.log(`Success`);
    return Promise.resolve(true);
  }
}
