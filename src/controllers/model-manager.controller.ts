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
import { ApiTags } from '@nestjs/swagger';
import { ModelEntity, PagedResult } from '../models/db-model';
import { Interface } from '../models/models';
import { ModelManagerService } from '../services/model-manager.service';

@ApiTags('manage')
@Controller('manage')
export class ModelManagerController {
  constructor(private readonly modelService: ModelManagerService) {}

  @Get('/services/:dtmi')
  getEntity(@Param('dtmi') dtmi: string): ModelEntity {
    const modelEntity = this.modelService.get(dtmi);
    if (!modelEntity) throw new NotFoundException('Model not found');
    return modelEntity;
  }

  @Get('/models')
  getAllEntities(
    @Query('page') page = 0,
    @Query('size') size = 100
  ): PagedResult<ModelEntity> {
    return this.modelService.getAll(page, size);
  }

  @Post('/services')
  addEntity(@Body() model: Interface) {
    return this.modelService.addNew(model);
  }

  @Post('/models')
  addEntities(@Body() models: Interface[]) {
    return this.modelService.addManyNew(models);
  }

  @Put('/services/:dtmi/revoke')
  revokeEntity(@Param('dtmi') dtmi: string) {
    return this.modelService.revokeModel(dtmi);
  }
}
