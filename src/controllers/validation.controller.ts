import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PartialSchema } from '../models/json-schema.model';
import { BaseDigitalTwin, DigitalTwinModel, Interface } from '../models/models';
import { SchemaValidationError } from '../models/validation-error.model';
import { ValidationService } from '../services/validation.service';

@ApiTags('validation')
@Controller('validate')
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name);

  constructor(private readonly validationService: ValidationService) {}

  @Get('/schema/:dtmi')
  @ApiOkResponse({
    description: 'Returns a JSON schema for the requested model',
  })
  getSchema(@Param('dtmi') dtmi: string): PartialSchema<Interface> {
    this.logger.log(`getSchema ${dtmi}`);
    return this.validationService.getJSONSchema(dtmi);
  }

  @Post()
  @ApiOperation({ summary: 'Validate twin instance' })
  @ApiOkResponse({
    description: 'Returns validation result for instance.',
    type: SchemaValidationError,
  })
  validateInstance(@Body() model: BaseDigitalTwin) {
    return this.validationService.validateInstance(model);
  }

  @Post('/graph')
  @ApiOperation({ summary: 'Validate twin graph' })
  @ApiOkResponse({
    description: 'Returns validation result for twin graph.',
    type: SchemaValidationError,
  })
  validateGraph(@Body() model: DigitalTwinModel) {
    return this.validationService.validateSubgraph(model);
  }
}
