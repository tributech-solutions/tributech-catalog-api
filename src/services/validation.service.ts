import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import Ajv, { ErrorObject } from 'ajv';
import { every, forEach } from 'lodash';
import { PartialSchema } from '../models/json-schema.model';
import {
  BaseDigitalTwin,
  BasicRelationship,
  DigitalTwinModel,
  Interface,
} from '../models/models';
import {
  SchemaErrorObject,
  SchemaValidationError,
  ValidationError,
} from '../models/validation-error.model';
import {
  generateJSONSchema,
  getRelationshipJSONSchema,
} from '../utils/validation.utils';
import { ModelGraphService } from './model-graph.service';
import { ModelManagerService } from './model-manager.service';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  constructor(
    private modelService: ModelManagerService,
    private modelGraphService: ModelGraphService
  ) {}

  getJSONSchema(dtmi: string): PartialSchema<Interface> {
    this.logger.verbose(`Return model entity for ${dtmi}.`);
    const model = this.modelGraphService.getExpanded(dtmi);
    if (!model) {
      throw new NotFoundException(`Model for ${dtmi} not found!`);
    }
    return generateJSONSchema(model);
  }

  validateInstance(instance: BaseDigitalTwin): SchemaValidationError {
    const dtmi = instance?.$metadata?.$model;
    if (!dtmi) throw new ValidationError('No model metadata!');
    const schema: PartialSchema<Interface> = this.getJSONSchema(dtmi);
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(instance);

    if (valid) {
      return { success: true, errors: [] };
    } else {
      return {
        success: false,
        errors: validate?.errors as SchemaErrorObject[],
      };
    }
  }

  validateSubgraph(graph: DigitalTwinModel): SchemaValidationError {
    const twins = graph?.digitalTwins || [];
    const relationships = graph?.relationships || [];

    const validTwinIds = twins?.map((t) => t?.$dtId) as string[];
    const twinValidationResults = twins?.map((t) => this.validateInstance(t));
    const relationshipResults = relationships?.map((t) =>
      this.validateRelationship(t, validTwinIds)
    );

    const success =
      every(twinValidationResults, (res) => res?.success) &&
      every(relationshipResults, (res) => res?.success);

    if (success) {
      return { success, errors: [] };
    }

    let errors: null | ErrorObject[] = [];

    forEach(
      twinValidationResults,
      (res) => (errors = [...(errors as any[]), ...(res?.errors as any)])
    );
    forEach(
      relationshipResults,
      (res) => (errors = [...(errors as any[]), ...(res?.errors as any)])
    );

    return { success, errors };
  }

  private validateRelationship(
    relationship: BasicRelationship,
    validTwinIds: string[]
  ): SchemaValidationError {
    const schema: PartialSchema<BasicRelationship> =
      getRelationshipJSONSchema(validTwinIds);
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(relationship);

    if (valid) {
      return { success: true, errors: [] };
    } else {
      return {
        success: false,
        errors: validate?.errors as SchemaErrorObject[],
      };
    }
  }
}
