import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import to from 'await-to-js';
import { cloneDeep } from 'lodash';
import { ModelEntity, PagedResult } from '../models/db-model';
import { Interface } from '../models/models';
import { ValidationError } from '../models/validation-error.model';
import { isValidInterface } from '../utils/dtml.utils';
import { ModelGraphService } from './model-graph.service';
import { StorageService } from './storage.service';

@Injectable()
export class ModelManagerService {
  private readonly logger = new Logger(ModelManagerService.name);

  constructor(
    private modelStore: InMemoryDBService<ModelEntity>,
    private modelGraphService: ModelGraphService,
    private storageService: StorageService
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

  async addNew(model: Interface, loadIntoGraph = true) {
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
    const [error, success] = await to(this.storageService.saveModel(entity));
    if (error) return Promise.reject(error);

    if (loadIntoGraph) {
      const [errorLoad, successLoad] = await to(
        this.modelGraphService.loadModelsIntoGraph([model])
      );
      if (errorLoad) return Promise.reject(errorLoad);
    }

    return this.modelStore.create(entity);
  }

  async addManyNew(models: Interface[], loadIntoGraph = true) {
    const [error, entities] = await to(
      Promise.all(models.map((m) => this.addNew(m, false)))
    );
    if (error) return Promise.reject(error);

    if (loadIntoGraph) {
      const [errorLoad, success] = await to(
        this.modelGraphService.loadModelsIntoGraph(models)
      );
      if (errorLoad) return Promise.reject(error);
    }
    return entities || [];
  }

  async revokeModel(dtmi: string) {
    const model = cloneDeep(this.get(dtmi));

    if (!model) {
      throw new NotFoundException(`Model ${dtmi} not known...`);
    }

    model.active = false;
    model.modifiedTime = new Date().toISOString();

    this.logger.log(`Revoking model(s) ${dtmi} ...`);
    this.modelStore.update(model);
    const [error, success] = await to(this.storageService.saveModel(model));
    if (error) {
      this.logger.error(error);
      return Promise.reject(error);
    }
    return model;
  }

  private createEntity(m: Interface): ModelEntity {
    return {
      id: m?.['@id'],
      active: true,
      createdTime: new Date().toISOString(),
      modifiedTime: '',
      model: m,
    };
  }
}
