import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { ValidationError } from 'src/models/validation-error.model';
import { ModelEntity, PagedResult } from '../models/db-model';
import { Interface } from '../models/models';
import { isValidInterface } from '../utils/dtml.utils';
import { ModelGraphService } from './model-graph.service';

@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);

  constructor(
    private modelStore: InMemoryDBService<ModelEntity>,
    private modelGraphService: ModelGraphService
  ) {}

  get(dtmi: string, includeRevoked?: boolean) {
    this.logger.verbose(`Return model entity for ${dtmi}.`);
    const model = this.modelStore.get(dtmi);
    return model?.active ? model : includeRevoked ? model : null;
  }

  getAll(page = 0, size = 100): PagedResult<ModelEntity> {
    this.logger.verbose(`Return models page=${page} and size=${size}.`);

    const data = this.modelStore.query((m) => m?.active);
    const startIdx = page * size;
    return {
      data: data?.slice(startIdx, startIdx + size),
      totalCount: data?.length,
    };
  }

  add(model: Interface) {
    if (!isValidInterface(model)) {
      throw new ValidationError('Invalid Interface!');
    }

    this.logger.verbose(`Trying to add new model for dtmi ${model?.['@id']}`);
    const existing = this.get(model?.['@id']);

    if (existing) {
      throw new ConflictException(
        `There is already a model for ${model?.['@id']} stored!`,
        'Create a new model or raise the version number instead.'
      );
    }

    const entity: ModelEntity = this.createEntity(model);
    this.modelGraphService.loadModelsIntoGraph([model]);
    return this.modelStore.create(entity);
  }

  addMany(models: Interface[]) {
    const entities: ModelEntity[] = models.map((m) => this.createEntity(m));
    this.modelGraphService.loadModelsIntoGraph(models);
    return this.modelStore.createMany(entities);
  }

  revokeModel(dtmi: string) {
    const model = cloneDeep(this.get(dtmi));

    if (!model) {
      throw new NotFoundException(`Model ${dtmi} not known...`);
    }

    model.active = false;
    model.modifiedTime = new Date().toISOString();

    console.log(`Deleting model(s) ${dtmi} ...`);
    this.modelStore.delete(dtmi);
  }

  private createEntity(m: Interface): ModelEntity {
    return {
      id: m?.['@id'],
      active: true,
      createdTime: new Date().toISOString(),
      modifiedTime: null,
      model: m,
    };
  }
}
