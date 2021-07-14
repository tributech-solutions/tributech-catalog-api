import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ModelEntity, ModelEntityPagedResult } from '../models/db-model';
import { Interface } from '../models/models';
import { ModelManagerService } from '../services/model-manager.service';

@ApiTags('manage-models')
@ApiOAuth2(['catalog-api'])
@Controller('manage')
export class ModelManagerController {
  constructor(private readonly modelService: ModelManagerService) {}

  @Get('/entity/:dtmi')
  @ApiOperation({
    operationId: 'getEntity',
    summary: 'Get the stored model entity.',
  })
  @ApiOkResponse({
    description: 'Returns the requested model entity based on its dtmi.',
    type: ModelEntity,
  })
  getEntity(@Param('dtmi') dtmi: string): ModelEntity {
    const modelEntity = this.modelService.get(dtmi);
    if (!modelEntity) throw new NotFoundException('Model not found');
    return modelEntity;
  }

  @Get('/entities')
  @ApiOperation({
    operationId: 'getAllEntities',
    summary: 'Get all stored model entities.',
  })
  @ApiOkResponse({
    description: 'Returns all stored model entities.',
    type: ModelEntityPagedResult,
  })
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'size', type: 'number' })
  getAllEntities(
    @Query('page') page = 0,
    @Query('size') size = 100
  ): ModelEntityPagedResult {
    return this.modelService.getAll(page, size);
  }

  @Post('/model')
  @ApiOperation({
    operationId: 'addNewModel',
    summary: 'Add a new model to the catalog api.',
  })
  @ApiCreatedResponse({
    description: 'The model has been successfully added.',
    type: ModelEntity,
  })
  addEntity(@Body() model: Interface) {
    return this.modelService.addNew(model);
  }

  @Post('/models')
  @ApiOperation({
    operationId: 'addNewModels',
    summary: 'Add multiple new models to the catalog api.',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: [ModelEntity],
  })
  @ApiBody({ type: [Interface] })
  addEntities(@Body() models: Interface[]) {
    return this.modelService.addManyNew(models);
  }

  @Put('/model/:dtmi/revoke')
  @ApiOperation({
    operationId: 'revokeModel',
    summary: 'Revoke a model.',
  })
  @ApiAcceptedResponse({
    description: 'The model has been successfully added.',
    type: ModelEntity,
  })
  revokeEntity(@Param('dtmi') dtmi: string) {
    return this.modelService.revokeModel(dtmi);
  }
}
