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
import { JSONSchema4 } from '../models/json_v4_schema.model';
import { BaseDigitalTwin, DigitalTwinModel } from '../models/models';
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
    type: JSONSchema4,
  })
  getSchema(@Param('dtmi') dtmi: string): JSONSchema4 {
    this.logger.log(`getSchema ${dtmi}`);
    return this.validationService.getJSONSchema(dtmi) as JSONSchema4;
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Validate twin instance' })
  @ApiOkResponse({
    description: 'Returns validation result for instance.',
    type: SchemaValidationError,
  })
  validateInstance(@Body() model: BaseDigitalTwin) {
    return this.validationService.validateInstance(model);
  }

  @Post('/graph')
  @HttpCode(200)
  @ApiOperation({ summary: 'Validate twin graph' })
  @ApiOkResponse({
    description: 'Returns validation result for twin graph.',
    type: SchemaValidationError,
  })
  validateGraph(@Body() model: DigitalTwinModel) {
    return this.validationService.validateSubgraph(model);
  }
}
