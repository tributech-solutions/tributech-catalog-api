import { Test } from '@nestjs/testing';
import {
  BaseDigitalTwin,
  BasicRelationship,
  DigitalTwinModel,
} from '../models/models';
import { SchemaValidationError } from '../models/validation-error.model';
import { ValidationService } from '../services/validation.service';
import { mockProvider } from '../utils/testing.utils';
import { ValidationController } from './validation.controller';

describe('ValidationController', () => {
  let validationController: ValidationController;
  let validationService: ValidationService;

  const exampleSchema = {
    $id: 'https://example.com/person.schema.json',
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Test',
    type: 'object',
    properties: {
      testProp: {
        type: 'string',
        description: "The person's first name.",
      },
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ValidationController],
      providers: [
        mockProvider(ValidationService, {
          getJSONSchema: (dtmi: string): any => exampleSchema,
          validateInstance: (
            instance: BaseDigitalTwin
          ): SchemaValidationError => ({
            success: true,
            errors: [],
          }),
          validateSubgraph: (
            graph: DigitalTwinModel
          ): SchemaValidationError => ({
            success: true,
            errors: [],
          }),
        }),
      ],
    }).compile();

    validationController = moduleRef.get(ValidationController);
    validationService = moduleRef.get(ValidationService);
  });

  it('should return a json schema for an stored dtmi', () => {
    const result = validationController.getSchema('dtmi:io:tributech:test;1');
    expect(result).toBe(exampleSchema);
    expect(validationService.getJSONSchema).toHaveBeenCalledTimes(1);
    expect(validationService.getJSONSchema).toHaveBeenCalledWith(
      'dtmi:io:tributech:test;1'
    );
  });

  it('should return validation result for instance', () => {
    const exampleTwin = {
      $dtId: 'test',
      $etag: 'etag',
      $metadata: {
        $model: 'dtmi:io:tributech:test;1',
      },
    };
    const result = validationController.validateInstance(exampleTwin);
    expect(result?.success).toBe(true);
    expect(result?.errors).toEqual([]);
    expect(validationService.validateInstance).toHaveBeenCalledTimes(1);
    expect(validationService.validateInstance).toHaveBeenCalledWith(
      exampleTwin
    );
  });

  it('should return validation result for graph', () => {
    const exampleTwin: BaseDigitalTwin = {
      $dtId: 'test',
      $etag: 'etag',
      $metadata: {
        $model: 'dtmi:io:tributech:test;1',
      },
    };

    const exampleTwin1: BaseDigitalTwin = {
      $dtId: 'test1',
      $etag: 'etag',
      $metadata: {
        $model: 'dtmi:io:tributech:test;1',
      },
    };

    const exampleRel: BasicRelationship = {
      $etag: 'etag',
      $relationshipId: 'relId',
      $targetId: 'test',
      $sourceId: 'test1',
      $relationshipName: 'Test Rel',
    };

    const graph = {
      digitalTwins: [exampleTwin, exampleTwin1],
      relationships: [exampleRel],
    };

    const result = validationController.validateGraph(graph);
    expect(result?.success).toBe(true);
    expect(result?.errors).toEqual([]);
    expect(validationService.validateSubgraph).toHaveBeenCalledTimes(1);
    expect(validationService.validateSubgraph).toHaveBeenCalledWith(graph);
  });
});
