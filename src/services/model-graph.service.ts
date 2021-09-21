import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiProperty } from '@nestjs/swagger';
import { to } from 'await-to-js';
import { JsonldGraph, Vertex } from 'jsonld-graph';
import { ModelEntity } from '../models/db-model';
import { context } from '../models/json-ld-context';
import { ExpandedInterface, Interface, Relationship } from '../models/models';
import {
  expandInterface,
  getChildrenVertices,
  hasNoIncomingRelationships,
  REL_TARGET_ANY,
} from '../utils/model.utils';

export class InterfaceWithChildren extends Interface {
  @ApiProperty({ type: [InterfaceWithChildren] })
  children: InterfaceWithChildren[];
}

export class InterfaceHashTree {
  [dtmi: string]: InterfaceWithChildren;
}

@Injectable()
export class ModelGraphService {
  private modelGraph: JsonldGraph;
  private readonly logger = new Logger(ModelGraphService.name);

  constructor(private modelStore: InMemoryDBService<ModelEntity>) {}

  getExpanded(modelId: string): ExpandedInterface {
    this.logger.verbose(`Get expanded model for ${modelId}`);
    const model = this.modelGraph.getVertex(modelId);
    if (!model) throw new NotFoundException('Model not found');
    return expandInterface(model);
  }

  getAllExpanded(page = 0, size = 100) {
    this.logger.verbose(`Get all expanded models`);

    const models = this.modelGraph
      .getVertices()
      .filter((x) => x.isType('dtmi:dtdl:class:Interface;2'))
      .items();

    const data = models.map((model) => expandInterface(model));

    const startIdx = page * size;
    return {
      data: data?.slice(startIdx, startIdx + size),
      totalCount: data?.length,
    };
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

  getChildren(modelId: string, depth = 1): ExpandedInterface[] {
    this.logger.verbose(`Get all child models`);
    const model = this.modelGraph.getVertex(modelId);
    if (!model) throw new NotFoundException('Model not found');

    return this.getChildrenRecursively(model, depth);
  }

  private getChildrenRecursively(
    vertex: Vertex,
    depth: number
  ): ExpandedInterface[] {
    // if we reached our target depth or we do not have any children => return model
    if (depth === 0 || getChildrenVertices(vertex)?.length == 0) {
      return [expandInterface(vertex)];
    } else {
      return [
        ...getChildrenVertices(vertex).reduce(
          (prev, v) => [...prev, ...this.getChildrenRecursively(v, depth - 1)],
          []
        ),
      ];
    }
  }

  getInvolvedRelationships(
    sourceModelId: string,
    targetModelId?: string
  ): Relationship[] {
    this.logger.verbose(
      `Get involved relationships ${sourceModelId} --> ${targetModelId}`
    );

    const sourceModel = this.getExpanded(sourceModelId);
    if (!sourceModel) {
      throw new NotFoundException(`Model with ${sourceModelId} not found!`);
    }

    if (targetModelId) {
      const targetModel = this.getExpanded(targetModelId);
      if (!targetModel) {
        throw new NotFoundException(`Model with ${targetModelId} not found!`);
      }

      return (
        sourceModel?.relationships?.filter(
          (x) =>
            x.target === REL_TARGET_ANY ||
            x.target === targetModelId ||
            targetModel?.bases?.some((y) => y === x.target)
        ) || []
      );
    }
    return sourceModel?.relationships || [];
  }

  async initialize() {
    if (!this.modelGraph) {
      const models = this.modelStore.getAll();
      // Load contexts/vocabulary
      this.modelGraph = new JsonldGraph();
      this.modelGraph.addContext('dtmi:dtdl:context;2', context);

      if (models.length > 0) {
        await this.loadModelsIntoGraph(
          models.map((m) => m?.model) as Interface[]
        );
      }
    }
  }

  @OnEvent('model.created', { async: true })
  async loadModelsIntoGraph(models: Interface[]) {
    this.logger.log(`Loading ${models?.length} models into graph...`);
    const [error, success] = await to(this.modelGraph.parse(models));
    if (error) {
      this.logger.error(
        `Error while trying to insert ${models?.length} into the graph.`,
        error?.message
      );
      return Promise.reject(error);
    }
    this.logger.log(`Successfully inserted ${models?.length} into the graph.`);
    return Promise.resolve(true);
  }
}
