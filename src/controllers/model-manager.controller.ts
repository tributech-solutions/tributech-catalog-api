import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModelService } from '../model/model.service';
import { ModelEntity, PagedResult } from '../models/db-model';
import { Interface } from '../models/models';

@ApiTags('manage')
@Controller('manage')
export class ModelManagerController {
  constructor(private readonly modelService: ModelService) {}

  @Get('/model/:dtmi')
  getEntity(@Param('dtmi') dtmi: string): ModelEntity {
    return this.modelService.get(dtmi);
  }

  @Get('/models')
  getAllEntities(
    @Query('page') page = 0,
    @Query('size') size = 100
  ): PagedResult<ModelEntity> {
    return this.modelService.getAll(page, size);
  }

  @Post('/model')
  addEntity(@Body() model: Interface): ModelEntity {
    return this.modelService.add(model);
  }

  @Post('/models')
  addEntities(@Body() models: Interface[]): ModelEntity[] {
    return this.modelService.addMany(models);
  }

  @Put('/model/:dtmi/revoke')
  removeEntity(@Param('dtmi') dtmi: string): void {
    return this.modelService.revokeModel(dtmi);
  }
}
