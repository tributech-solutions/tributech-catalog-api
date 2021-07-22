import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Test } from '@nestjs/testing';
import { ContextType, InterfaceType } from '../models/models';
import { mockProvider } from '../utils/testing.utils';
import { ModelGraphService } from './model-graph.service';

describe('ModelGraphService', () => {
  let modelGraphService: ModelGraphService;

  const baseDevice = {
    '@context': 'dtmi:dtdl:context;2',
    '@id': 'dtmi:io:tributech:device:base;1',
    '@type': 'Interface',
    displayName: 'Device',
    contents: [
      {
        '@type': 'Property',
        name: 'DeviceId',
        schema: 'string',
        writable: false,
        displayName: 'Device Id',
        description: 'Represents the unique ID of the Tributech-device.',
        comment: 'Device ID needs to be a UUID.',
      },
      {
        '@type': 'Property',
        name: 'Name',
        schema: 'string',
        writable: true,
        displayName: 'Name',
        description: 'Represents the name of the Tributech-device.',
        comment: 'DemoComment',
      },
      {
        '@type': 'Relationship',
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

  const edgeDevice = {
    '@context': 'dtmi:dtdl:context;2',
    '@id': 'dtmi:io:tributech:device:edge;1',
    extends: 'dtmi:io:tributech:device:base;1',
    '@type': 'Interface',
    displayName: 'Edge',
    description: 'Demo Description',
    comment: 'Demo Comment',
    contents: [
      {
        '@type': 'Property',
        name: 'MaxMerkleTreeDepth',
        schema: 'integer',
        writable: true,
        displayName: 'Max merkle tree depth',
        description: 'The Max merkle tree depth',
        comment: 'DemoComment',
      },
      {
        '@type': 'Property',
        name: 'MaxMerkleTreeAge',
        schema: 'integer',
        writable: true,
        displayName: 'Max merkle tree age',
        description: 'The Max merkle tree age',
        comment: 'DemoComment',
      },
    ],
  };

  const sink = {
    '@context': 'dtmi:dtdl:context;2',
    '@id': 'dtmi:io:tributech:sink:base;1',
    '@type': 'Interface',
    displayName: 'Sink',
    contents: [
      {
        '@type': 'Property',
        name: 'MaxBatchSize',
        schema: 'integer',
        writable: true,
        displayName: 'Max batch size',
        comment: 'DemoComment',
        description:
          'The maximum number of values to send as batch in one message to the sink.',
      },
      {
        '@type': 'Property',
        name: 'FlushInterval',
        schema: 'integer',
        writable: true,
        displayName: 'Flush interval',
        comment: 'DemoComment',
        description:
          'The interval in which the values should be flushed from the buffer and send to the API. Regardless if the MaxBatchSize was reached.',
      },
    ],
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ModelGraphService,
        mockProvider(InMemoryDBService, {
          getAll: (): any[] => [
            { model: baseDevice },
            { model: edgeDevice },
            { model: sink },
          ],
        }),
      ],
    }).compile();

    modelGraphService = moduleRef.get(ModelGraphService);
    spyOn(modelGraphService, 'loadModelsIntoGraph').and.callThrough();
    await modelGraphService.initialize();
  });

  it('should load stored models into graph when initialized', async () => {
    expect(modelGraphService.loadModelsIntoGraph).toHaveBeenCalledTimes(1);
    expect(modelGraphService.loadModelsIntoGraph).toHaveBeenCalledWith([
      baseDevice,
      edgeDevice,
      sink,
    ]);
  });

  it('should throw if trying to expand unknown model', () => {
    expect(() =>
      modelGraphService.getExpanded('dtmi:io:tributech:throw;1')
    ).toThrowError('Model not found');
  });

  it('should return expanded interface for edge model', () => {
    const expandedModel = modelGraphService.getExpanded(
      'dtmi:io:tributech:device:edge;1'
    );
    expect(expandedModel).toEqual({
      '@id': 'dtmi:io:tributech:device:edge;1',
      '@type': [InterfaceType.Interface],
      '@context': ContextType.DTDL2,
      displayName: 'Edge',
      description: 'Demo Description',
      comment: 'Demo Comment',
      properties: [
        jasmine.objectContaining({
          '@type': ['Property'],
          name: 'DeviceId',
          schema: 'string',
          writable: false,
          displayName: 'Device Id',
          description: 'Represents the unique ID of the Tributech-device.',
          comment: 'Device ID needs to be a UUID.',
        }),
        jasmine.objectContaining({
          '@type': ['Property'],
          name: 'Name',
          schema: 'string',
          writable: true,
          displayName: 'Name',
          description: 'Represents the name of the Tributech-device.',
          comment: 'DemoComment',
        }),
        jasmine.objectContaining({
          '@type': ['Property'],
          name: 'MaxMerkleTreeDepth',
          schema: 'integer',
          writable: true,
          displayName: 'Max merkle tree depth',
          description: 'The Max merkle tree depth',
          comment: 'DemoComment',
        }),
        jasmine.objectContaining({
          '@type': ['Property'],
          name: 'MaxMerkleTreeAge',
          schema: 'integer',
          writable: true,
          displayName: 'Max merkle tree age',
          description: 'The Max merkle tree age',
        }),
      ],
      relationships: [
        jasmine.objectContaining({
          '@type': ['Relationship'],
          name: 'Sinks',
          target: 'dtmi:io:tributech:sink:base;1',
          displayName: 'Sinks',
          description: 'Contains all sinks of the given device.',
          comment: 'DemoComment',
          properties: [],
        }),
      ],
      telemetries: [],
      components: [],
      commands: [],
      bases: ['dtmi:io:tributech:device:base;1'],
    });
  });

  it('should return root models in expanded form', () => {
    const rootModels = modelGraphService.getRoots();
    expect(rootModels).toEqual([
      jasmine.objectContaining({
        '@id': 'dtmi:io:tributech:device:edge;1',
      }),
    ]);
  });

  it('should get the involved relationships between two models', () => {
    const relationships = modelGraphService.getInvolvedRelationships(
      'dtmi:io:tributech:device:edge;1',
      'dtmi:io:tributech:sink:base;1'
    );
    expect(relationships.length).toEqual(1);
    expect(relationships).toEqual([
      jasmine.objectContaining({
        '@type': ['Relationship'],
        name: 'Sinks',
        target: 'dtmi:io:tributech:sink:base;1',
        displayName: 'Sinks',
        description: 'Contains all sinks of the given device.',
        comment: 'DemoComment',
      }),
    ]);
  });
});
