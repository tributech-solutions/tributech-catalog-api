import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import Ajv from 'ajv';
import { PartialSchema } from '../models/json-schema.model';
import { BaseDigitalTwin, Interface } from '../models/models';
import { ValidationError } from '../models/validation-error.model';
import { generateJSONSchema } from '../utils/validation.utils';
import { ModelGraphService } from './model-graph.service';
import { ModelService } from './model.service';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  constructor(
    private modelService: ModelService,
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

  validateInstance(instance: BaseDigitalTwin) {
    const dtmi = instance?.$metadata?.$model;
    if (!dtmi) throw new ValidationError('No model metadata!');
    const schema: PartialSchema<Interface> = this.getJSONSchema(dtmi);
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(instance);

    if (valid) {
      console.log('Instance is valid :-)');
      return { success: true, errors: [] };
    } else {
      console.log('Instance is invalid :-(');
      return { success: false, errors: validate?.errors };
    }
  }
}
