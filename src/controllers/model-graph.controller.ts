import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ExpandedInterfacePagedResult } from '../models/db-model';
import { ExpandedInterface, Interface, Relationship } from '../models/models';
import { ModelGraphService } from '../services/model-graph.service';
import { ModelManagerService } from '../services/model-manager.service';

@ApiTags('dtdl-models')
@ApiOAuth2(['catalog-api'])
@Controller('graph')
export class ModelGraphController {
  private readonly logger = new Logger(ModelGraphController.name);

  constructor(
    private readonly modelService: ModelManagerService,
    private readonly modelGraphService: ModelGraphService
  ) {}

  @Get('/expanded')
  @ApiOkResponse({
    description: 'Returns all stored models in their expanded representation.',
    type: ExpandedInterfacePagedResult,
  })
  @ApiOperation({
    operationId: 'getExpandedModels',
    summary: 'Get all stored models in expanded form.',
  })
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'size', type: 'number' })
  getExpandedModels(
    @Query('page') page = 0,
    @Query('size') size = 100
  ): ExpandedInterfacePagedResult {
    this.logger.log(`getExpandedModels`);
    return this.modelGraphService.getAllExpanded(page, size);
  }

  @Get('roots')
  @ApiOperation({
    operationId: 'getRoots',
    summary: 'Get stored root models in expanded form.',
  })
  @ApiOkResponse({
    description: 'Returns root models in their expanded representation.',
    type: [ExpandedInterface],
  })
  getRoots(): ExpandedInterface[] {
    this.logger.log(`getRoots`);
    return this.modelGraphService.getRoots();
  }

  @Get('/:dtmi/expand')
  @ApiOperation({
    operationId: 'getExpanded',
    summary: 'Get the requested model in expanded form.',
  })
  @ApiOkResponse({
    description: 'Returns a model in its expanded representation.',
    type: ExpandedInterface,
  })
  getExpanded(@Param('dtmi') dtmi: string): ExpandedInterface {
    this.logger.log(`getExpanded ${dtmi}`);
    return this.modelGraphService.getExpanded(dtmi);
  }

  @Get('/relationships/:sourceDtmi/:targetDtmi')
  @ApiOperation({
    operationId: 'getRelationships',
    summary: 'Get the involved relationships between two models.',
  })
  @ApiOkResponse({
    description: 'Returns the possible relationships between two models.',
    type: [Relationship],
  })
  getRelationships(
    @Param('sourceDtmi') sourceDtmi: string,
    @Param('targetDtmi') targetDtmi: string
  ): Relationship[] {
    this.logger.log(`getRelationships ${sourceDtmi} --> ${targetDtmi}`);

    return this.modelGraphService.getInvolvedRelationships(
      sourceDtmi,
      targetDtmi
    );
  }

  @Get('/relationships/:sourceDtmi')
  @ApiOperation({
    operationId: 'getOutgoingRelationships',
    summary: 'Get the outgoing relationships of a model.',
  })
  @ApiOkResponse({
    description: 'Returns the possible relationships.',
    type: [Relationship],
  })
  getOutgoingRelationships(
    @Param('sourceDtmi') sourceDtmi: string
  ): Relationship[] {
    this.logger.log(`getOutgoingRelationships ${sourceDtmi}`);

    return this.modelGraphService.getInvolvedRelationships(sourceDtmi);
  }

  @Get('/:dtmi')
  @ApiOperation({
    operationId: 'getDTDLModel',
    summary: 'Get plain DTDL model.',
  })
  @ApiOkResponse({
    description: 'Returns a model based on its dtmi',
    type: Interface,
  })
  getModel(@Param('dtmi') dtmi: string): Interface {
    this.logger.log(`getModel ${dtmi}`);
    const expandedModel = this.modelService.get(dtmi);
    if (!expandedModel || !expandedModel?.model) {
      throw new NotFoundException('Model not found');
    }
    return expandedModel?.model;
  }
}
