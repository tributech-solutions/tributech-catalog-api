import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartialSchema } from '../models/json-schema.model';
import { BaseDigitalTwin, DigitalTwinModel, Interface } from '../models/models';
import { ValidationService } from '../services/validation.service';

@ApiTags('validation')
@Controller('validate')
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name);

  constructor(private readonly validationService: ValidationService) {}

  @Get('/schema/:dtmi')
  getSchema(@Param('dtmi') dtmi: string): PartialSchema<Interface> {
    this.logger.log(`getSchema ${dtmi}`);
    return this.validationService.getJSONSchema(dtmi);
  }

  @Post()
  validateInstance(@Body() model: BaseDigitalTwin) {
    return this.validationService.validateInstance(model);
  }

  @Post('/graph')
  validateGraph(@Body() model: DigitalTwinModel) {
    return this.validationService.validateSubgraph(model);
  }
}
