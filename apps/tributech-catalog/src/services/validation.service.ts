import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  generateJSONSchema,
  getRelationshipJSONSchema,
} from '@tributech/self-description';
import Ajv, { ErrorObject } from 'ajv';
import { every, forEach } from 'lodash';
import { JSONSchema } from '../../../../libs/twin-models/src/models/json-schema';
import { TwinGraph, TwinInstance, TwinRelationship } from '../models/models';
import {
  SchemaErrorObject,
  SchemaValidationError,
  ValidationError,
} from '../models/validation-error.model';
import { ModelGraphService } from './model-graph.service';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  constructor(private modelGraphService: ModelGraphService) {}

  getJSONSchema(dtmi: string): JSONSchema {
    this.logger.verbose(`Return model entity for ${dtmi}.`);
    const model = this.modelGraphService.getExpanded(dtmi);
    if (!model) {
      throw new NotFoundException(`Model for ${dtmi} not found!`);
    }
    return generateJSONSchema(model);
  }

  validateInstance(instance: TwinInstance): SchemaValidationError {
    const dtmi = instance?.$metadata?.$model;
    if (!dtmi) throw new ValidationError('No model metadata!');
    const schema: JSONSchema = this.getJSONSchema(dtmi);
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

  validateSubgraph(graph: TwinGraph): SchemaValidationError {
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
    relationship: TwinRelationship,
    validTwinIds: string[]
  ): SchemaValidationError {
    const schema: JSONSchema = getRelationshipJSONSchema(validTwinIds);
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
