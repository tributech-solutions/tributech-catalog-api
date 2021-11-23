import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { HttpService } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  ContextType,
  Interface,
  SelfDescriptionType,
} from '@tributech/self-description';
import { of } from 'rxjs';
import { SettingsModel } from '../config/settings.model';
import { ModelEntity } from '../models/db-model';
import { Vocabulary } from '../models/vocabulary';
import { mockProvider } from '../shared/testing.utils';
import { InitializeService } from './initialize.service';

describe('InitializeService', () => {
  let initializeService: InitializeService;
  let modelStore: InMemoryDBService<ModelEntity>;

  const exampleConfig: Partial<SettingsModel> = {
    ExternalCatalogs: ['catalog'],
    ExternalModels: ['test'],
  };

  const vocabulary: Vocabulary = {
    name: 'Tributech Core Vocabulary',
    tags: ['tributech', 'data-asset-twins', 'iot', 'iiot'],
    issuer: 'Tributech Solutions GmBH',
    issuerURL: 'https://tributech.io',
    documentationURL: 'https://github.com/tributech-solutions/data-asset-twin',
    references: ['doc'],
  };

  const model: Interface = {
    '@context': ContextType.DTDL2,
    '@id': 'dtmi:io:tributech:device:base;1',
    '@type': SelfDescriptionType.Interface,
    displayName: 'Device',
    contents: [
      {
        '@type': SelfDescriptionType.Property,
        name: 'Name',
        schema: 'string',
        writable: true,
        displayName: 'Name',
        description: 'Represents the name of the Tributech-device.',
        comment: 'DemoComment',
      },
      {
        '@type': SelfDescriptionType.Relationship,
        name: 'Sinks',
        minMultiplicity: 0,
        maxMultiplicity: 2,
        target: 'dtmi:io:tributech:sink:base;1',
        displayName: 'Sinks',
        description: 'Contains all sinks of the given device.',
        comment: 'DemoComment',
      },
    ],
  };

  let storage: any[] = [];
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        InitializeService,
        mockProvider(InMemoryDBService, {
          getAll: () => {
            return storage || [];
          },
          updateMany: (record: Partial<ModelEntity>[]) => {
            storage = [...storage, ...record];
            return storage;
          },
        }),
        mockProvider(HttpService, {
          get: (url: string) => {
            if (url?.includes('catalog')) {
              return of({ data: vocabulary });
            } else {
              return of({ data: model });
            }
          },
        }),
      ],
    }).compile();

    initializeService = moduleRef.get(InitializeService);
    modelStore = moduleRef.get(InMemoryDBService);
    storage = [];
    spyOn(initializeService, 'getConfig').and.returnValue(exampleConfig);
  });

  it('should call load functions', async () => {
    spyOn(initializeService as any, 'loadExternalCatalogs').and.callFake(() => {
      /*noop*/
    });
    spyOn(initializeService as any, 'loadExternalModels').and.callFake(() => {
      /*noop*/
    });
    spyOn(initializeService as any, 'loadExistingModels').and.callFake(() => {
      /*noop*/
    });

    await initializeService.initialize();

    expect(
      (initializeService as any).loadExternalCatalogs
    ).toHaveBeenCalledTimes(1);
    expect((initializeService as any).loadExternalModels).toHaveBeenCalledTimes(
      1
    );
    expect((initializeService as any).loadExistingModels).toHaveBeenCalledTimes(
      1
    );
  });

  it('should load external catalog', async () => {
    spyOn(initializeService as any, 'loadExternalModels').and.callFake(() => {
      /*noop*/
    });
    spyOn(initializeService as any, 'loadExistingModels').and.callFake(() => {
      /*noop*/
    });
    await initializeService.initialize();

    const storedModels = modelStore.getAll();

    expect(storedModels.length).toEqual(1);
    expect(storedModels[0].id).toEqual(model['@id']);
  });

  it('should load external models', async () => {
    spyOn(initializeService as any, 'loadExternalCatalogs').and.callFake(() => {
      /*noop*/
    });
    spyOn(initializeService as any, 'loadExistingModels').and.callFake(() => {
      /*noop*/
    });
    await initializeService.initialize();

    const storedModels = modelStore.getAll();

    expect(storedModels.length).toEqual(1);
    expect(storedModels[0].id).toEqual(model['@id']);
  });
});
