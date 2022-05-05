import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Schema } from '../models/json-schema';
import { TwinGraph, TwinInstance } from '../models/models';
import { SchemaValidationError } from '../models/validation-error.model';
import { ValidationService } from '../services/validation.service';

@ApiTags('validation')
@ApiOAuth2(['catalog-api'])
@Controller('validate')
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name);

  constructor(private readonly validationService: ValidationService) {}

  @Get('/schema/:dtmi')
  @ApiOkResponse({
    description: 'Returns a JSON schema for the requested model',
    type: Schema,
  })
  getSchema(@Param('dtmi') dtmi: string): Schema {
    this.logger.log(`getSchema ${dtmi}`);
    return this.validationService.getJSONSchema(dtmi) as Schema;
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Validate twin instance' })
  @ApiOkResponse({
    description: 'Returns validation result for instance.',
    type: SchemaValidationError,
  })
  validateInstance(@Body() model: TwinInstance) {
    return this.validationService.validateInstance(model);
  }

  @Post('/graph')
  @HttpCode(200)
  @ApiOperation({ summary: 'Validate twin graph' })
  @ApiOkResponse({
    description: 'Returns validation result for twin graph.',
    type: SchemaValidationError,
  })
  validateGraph(@Body() model: TwinGraph) {
    return this.validationService.validateSubgraph(model);
  }
}
