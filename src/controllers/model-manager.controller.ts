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
  ApiExtraModels,
  ApiOAuth2,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ModelEntity, PagedResult } from '../models/db-model';
import { Interface } from '../models/models';
import { ModelManagerService } from '../services/model-manager.service';

@ApiTags('manage')
@ApiOAuth2(['catalog-api'])
@Controller('manage')
export class ModelManagerController {
  constructor(private readonly modelService: ModelManagerService) {}

  @Get('/services/:dtmi')
  @ApiOkResponse({
    description: 'Returns the requested model entity based on its dtmi.',
    type: ModelEntity,
  })
  getEntity(@Param('dtmi') dtmi: string): ModelEntity {
    const modelEntity = this.modelService.get(dtmi);
    if (!modelEntity) throw new NotFoundException('Model not found');
    return modelEntity;
  }

  @Get('/models')
  @ApiExtraModels(ModelEntity, PagedResult)
  @ApiOkResponse({
    description: 'Returns all stored model entities.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PagedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ModelEntity) },
            },
          },
        },
      ],
    },
  })
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'size', type: 'number' })
  getAllEntities(
    @Query('page') page = 0,
    @Query('size') size = 100
  ): PagedResult<ModelEntity> {
    return this.modelService.getAll(page, size);
  }

  @Post('/model')
  @ApiCreatedResponse({
    description: 'The model has been successfully added.',
    type: ModelEntity,
  })
  addEntity(@Body() model: Interface) {
    return this.modelService.addNew(model);
  }

  @Post('/models')
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: [ModelEntity],
  })
  @ApiBody({ type: [Interface] })
  addEntities(@Body() models: Interface[]) {
    return this.modelService.addManyNew(models);
  }

  @Put('/services/:dtmi/revoke')
  @ApiAcceptedResponse({
    description: 'The model has been successfully added.',
    type: ModelEntity,
  })
  revokeEntity(@Param('dtmi') dtmi: string) {
    return this.modelService.revokeModel(dtmi);
  }
}
