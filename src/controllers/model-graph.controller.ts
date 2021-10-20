import {
  BadRequestException,
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
import { ParsedInterface } from '../models/parsed-models';
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

  @Get('/:dtmi/bases')
  @ApiOperation({
    operationId: 'getBases',
    summary: 'Gets the bases of the requested model',
  })
  @ApiOkResponse({
    description: 'Returns the bases of a model',
    type: [String],
  })
  getBases(@Param('dtmi') dtmi: string): string[] {
    this.logger.log(`getBases ${dtmi}`);
    return this.modelGraphService.getExpanded(dtmi)?.bases || [];
  }

  @Get('/:dtmi/children')
  @ApiOperation({
    operationId: 'getChildren',
    summary:
      'Gets the children of the requested model up to a optionally specified depth',
  })
  @ApiOkResponse({
    description: 'Returns the children of a model',
    type: [ExpandedInterface],
  })
  @ApiQuery({ name: 'depth', type: 'number', required: false })
  getChildren(
    @Param('dtmi') dtmi: string,
    @Query('depth') depth = 1
  ): ExpandedInterface[] {
    this.logger.log(`getChildren ${dtmi}`);

    if (depth === 0 || depth > 8) {
      throw new BadRequestException('Depth needs to be > 0 and < 8!');
    }
    return this.modelGraphService.getChildren(dtmi, depth) || [];
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

  @Get('/:dtmi/simplified')
  @ApiOperation({
    operationId: 'getSimplified',
    summary: 'Get the requested model in simplified form.',
  })
  @ApiOkResponse({
    description: 'Returns a model in its simplified representation.',
    type: ParsedInterface,
  })
  getSimplified(@Param('dtmi') dtmi: string): ParsedInterface {
    this.logger.log(`getSimplified ${dtmi}`);
    return this.modelGraphService.getSimplified(dtmi);
  }

  @Get('/:dtmi/full-expand')
  @ApiOperation({
    operationId: 'getFullyExpanded',
    summary:
      'Get the requested model with related models inlined (JSON-LD representation).',
  })
  @ApiOkResponse({
    description: 'Returns a model in its expanded representation.',
    type: ExpandedInterface,
  })
  @ApiQuery({ name: 'includeContext', type: 'boolean', required: false })
  getParsed(
    @Param('dtmi') dtmi: string,
    @Query('includeContext') includeContext = false
  ) {
    this.logger.log(`getParsed ${dtmi}`);
    return this.modelGraphService.fullExpand(dtmi, includeContext);
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
