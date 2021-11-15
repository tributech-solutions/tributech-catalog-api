import { Test } from '@nestjs/testing';
import {
  ContextType,
  DTMI_REGEX,
  ExpandedInterface,
  mockProvider,
  SelfDescriptionType,
  TwinInstance,
  TwinRelationship,
} from '@tributech/self-description';
import { ModelGraphService } from './model-graph.service';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let validationService: ValidationService;

  const testModel: ExpandedInterface = {
    '@id': 'dtmi:io:tributech:test;1',
    '@type': SelfDescriptionType.Interface,
    '@context': ContextType.DTDL2,
    displayName: 'Test',
    properties: [
      {
        '@type': SelfDescriptionType.Property,
        name: 'Name',
        schema: 'string',
      },
    ],
  };

  const caseModel: ExpandedInterface = {
    '@id': 'dtmi:io:tributech:test_case;1',
    '@type': SelfDescriptionType.Interface,
    '@context': ContextType.DTDL2,
    displayName: 'Test',
    properties: [
      {
        '@type': SelfDescriptionType.Property,
        name: 'Name',
        schema: 'string',
      },
    ],
    relationships: [
      {
        '@type': SelfDescriptionType.Relationship,
        name: 'Tests',
        target: 'dtmi:io:tributech:test;1',
      },
    ],
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ValidationService,
        mockProvider(ModelGraphService, {
          getExpanded: (modelId: string): ExpandedInterface | undefined => {
            if (modelId.includes('throw')) return undefined;
            if (modelId === 'dtmi:io:tributech:test;1') return testModel;
            return caseModel;
          },
        }),
      ],
    }).compile();

    validationService = moduleRef.get(ValidationService);
  });

  it('should return a valid JSON schema if model is known', () => {
    const schema = validationService.getJSONSchema('dtmi:io:tributech:test;1');
    expect(schema).toBeTruthy();
    expect(schema).toHaveProperty('type', 'object');
    expect(schema).toHaveProperty('required', ['$dtId', '$etag', '$metadata']);
    expect(schema).toHaveProperty('additionalProperties', false);
    const schemaProperties = schema?.properties;
    expect(schemaProperties).toHaveProperty('$dtId', { type: 'string' });
    expect(schemaProperties).toHaveProperty('$etag', { type: 'string' });
    expect(schemaProperties).toHaveProperty('$metadata', {
      type: 'object',
      properties: {
        $model: {
          type: 'string',
          pattern: DTMI_REGEX,
        },
      },
      required: ['$model'],
    });
    expect(schemaProperties).toHaveProperty('$dtId', { type: 'string' });
    expect(schemaProperties).toHaveProperty('Name', { type: 'string' });
  });

  it('should throw when trying to get JSON schema if model is not known', () => {
    expect(() =>
      validationService.getJSONSchema('dtmi:io:tributech:throw;1')
    ).toThrowError(`Model for dtmi:io:tributech:throw;1 not found!`);
  });

  it('should validate instance of model', () => {
    const twin: TwinInstance = {
      $dtId: 'dtId',
      $etag: 'etag',
      Name: 'Test',
      $metadata: {
        $model: 'dtmi:io:tributech:test;1',
      },
    };

    const validationResult = validationService.validateInstance(twin);
    expect(validationResult?.success).toEqual(true);
  });

  it('should validate subgraph with relationships', () => {
    const test: TwinInstance = {
      $dtId: 'test',
      $etag: 'etag',
      Name: 'Test',
      $metadata: {
        $model: 'dtmi:io:tributech:test;1',
      },
    };

    const test1: TwinInstance = {
      $dtId: 'test1',
      $etag: 'etag',
      Name: 'Test1',
      $metadata: {
        $model: 'dtmi:io:tributech:test;1',
      },
    };

    const case1: TwinInstance = {
      $dtId: 'case',
      $etag: 'etag',
      Name: 'Case',
      $metadata: {
        $model: 'dtmi:io:tributech:test_case;1',
      },
    };

    const rel1: TwinRelationship = {
      $etag: 'etag',
      $relationshipId: 'id1',
      $relationshipName: 'Tests',
      $sourceId: 'case',
      $targetId: 'test',
    };

    const rel2: TwinRelationship = {
      $etag: 'etag',
      $relationshipId: 'id1',
      $relationshipName: 'Tests',
      $sourceId: 'case',
      $targetId: 'test',
    };

    const validationResult = validationService.validateSubgraph({
      digitalTwins: [test, test1, case1],
      relationships: [rel1, rel2],
    });
    expect(validationResult?.success).toEqual(true);
  });
});
