import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { ModelEntity } from '../models/db-model';
import {
  ContextType,
  Interface,
  InterfaceType,
  ModelType,
} from '../models/models';
import { ValidationError } from '../models/validation-error.model';
import { mockProvider } from '../utils/testing.utils';
import { ModelManagerService } from './model-manager.service';
import { StorageService } from './storage.service';

describe('ModelManagerService', () => {
  let modelManagerService: ModelManagerService;
  let storageService: StorageService;
  let eventEmitter: EventEmitter2;

  const modelEntity: ModelEntity = {
    id: 'dtmi:io:tributech:test;1',
    active: true,
    createdTime: '',
    modifiedTime: '',
    model: {
      '@id': 'dtmi:io:tributech:test;1',
      '@type': [InterfaceType.Interface],
      '@context': ContextType.DTDL2,
      displayName: 'Test',
      contents: [
        {
          '@type': [ModelType.Property],
          name: 'Name',
          schema: 'string',
        },
      ],
    },
  };

  const newModel: Interface = {
    '@id': 'dtmi:io:tributech:test1;1',
    '@type': [InterfaceType.Interface],
    '@context': ContextType.DTDL2,
    displayName: 'Test1',
    contents: [
      {
        '@type': [ModelType.Property],
        name: 'Name',
        schema: 'string',
      },
    ],
  };

  const newModel1: Interface = {
    '@id': 'dtmi:io:tributech:test2;1',
    '@type': [InterfaceType.Interface],
    '@context': ContextType.DTDL2,
    displayName: 'Test2',
    contents: [
      {
        '@type': [ModelType.Property],
        name: 'Name',
        schema: 'string',
      },
    ],
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ModelManagerService,
        mockProvider(EventEmitter2),
        mockProvider(StorageService, {
          saveModel: (content: ModelEntity) => Promise.resolve(),
        }),
        mockProvider(InMemoryDBService, {
          get: (id: string) => {
            if (id === 'dtmi:io:tributech:test;1') return modelEntity;
            return undefined;
          },
          query: (predicate: (record: ModelEntity) => boolean): any[] => [
            { id: 'dtmi:io:tributech:test;1' },
            { id: 'dtmi:io:tributech:test;2' },
            { id: 'dtmi:io:tributech:test;3' },
            { id: 'dtmi:io:tributech:test;4' },
            { id: 'dtmi:io:tributech:test;5' },
            { id: 'dtmi:io:tributech:test;6' },
            { id: 'dtmi:io:tributech:test;7' },
            { id: 'dtmi:io:tributech:test;8' },
            { id: 'dtmi:io:tributech:test;9' },
            { id: 'dtmi:io:tributech:test;10' },
          ],
          create(record: Partial<ModelEntity>): Partial<ModelEntity> {
            return record;
          },
        }),
      ],
    }).compile();

    modelManagerService = moduleRef.get(ModelManagerService);
    storageService = moduleRef.get(StorageService);
    eventEmitter = moduleRef.get(EventEmitter2);
  });

  it('should return model if known', () => {
    const modelEntity = modelManagerService.get('dtmi:io:tributech:test;1');
    expect(modelEntity).toBeTruthy();
    expect(modelEntity).toEqual(modelEntity);
  });

  it('should return null if model is not known', () => {
    const modelEntity = modelManagerService.get('dtmi:io:tributech:notknown;1');
    expect(modelEntity).toBe(null);
  });

  it('should return stored models using a paged response', () => {
    const firstPage = modelManagerService.getAll(0, 5);
    expect(firstPage.totalCount).toEqual(10);
    expect(firstPage.data.length).toEqual(5);
    expect(firstPage?.data?.[0]?.id).toEqual('dtmi:io:tributech:test;1');
    const secondPage = modelManagerService.getAll(1, 5);
    expect(secondPage.totalCount).toEqual(10);
    expect(secondPage.data.length).toEqual(5);
    expect(secondPage?.data?.[0]?.id).toEqual('dtmi:io:tributech:test;6');
  });

  it('should throw if model dtmi is invalid', async () => {
    expect.assertions(1);
    try {
      await modelManagerService.addNew({ '@id': 'invalid:dtmi' } as any);
    } catch (e) {
      expect(e).toEqual(new ValidationError('Invalid DTMI'));
    }
  });

  it('should throw if model is already known', async () => {
    expect.assertions(1);
    try {
      await modelManagerService.addNew({
        '@id': 'dtmi:io:tributech:test;1',
        '@type': InterfaceType.Interface,
        '@context': ContextType.DTDL2,
      } as any);
    } catch (e) {
      expect(e).toEqual(
        new ConflictException(
          `There is already a model for dtmi:io:tributech:test;1 stored!`,
          'Create a new model or raise the version number instead.'
        )
      );
    }
  });

  it('should add new model and load it', async () => {
    const modelEntity = await modelManagerService.addNew(newModel);
    expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(eventEmitter.emit).toHaveBeenCalledWith('model.created', [newModel]);
    expect(modelEntity?.id).toEqual(newModel?.['@id']);
    expect(modelEntity?.model).toEqual(newModel);
  });

  it('should add new model and not load it', async () => {
    const modelEntity = await modelManagerService.addNew(newModel, false);
    expect(eventEmitter.emit).toHaveBeenCalledTimes(0);
    expect(modelEntity?.id).toEqual(newModel?.['@id']);
    expect(modelEntity?.model).toEqual(newModel);
  });

  it('should add multiple new model and load them', async () => {
    const models = [newModel, newModel1];
    const entities = await modelManagerService.addManyNew(models);
    expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
    expect(eventEmitter.emit).toHaveBeenCalledWith('model.created', models);
    expect(entities[0]?.id).toEqual(newModel?.['@id']);
    expect(entities[0]?.model).toEqual(newModel);
    expect(entities[1]?.id).toEqual(newModel1?.['@id']);
    expect(entities[1]?.model).toEqual(newModel1);
  });

  it('should throw when trying to revoke an unknown model', async () => {
    expect.assertions(1);
    try {
      await modelManagerService.revokeModel('dtmi:io:tributech:test5;1');
    } catch (e) {
      expect(e).toEqual(
        new NotFoundException(`Model dtmi:io:tributech:test5;1 not known...`)
      );
    }
  });

  it('should revoke a model if it is known', async () => {
    const model = await modelManagerService.revokeModel(
      'dtmi:io:tributech:test;1'
    );
    expect(model.active).toBe(false);
  });
});
