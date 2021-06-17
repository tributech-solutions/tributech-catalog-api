import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOAuth2,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PagedResult } from '../models/db-model';
import { ExpandedInterface, Interface, Relationship } from '../models/models';
import {
  InterfaceWithChildren,
  ModelGraphService,
} from '../services/model-graph.service';
import { ModelManagerService } from '../services/model-manager.service';

@ApiTags('models')
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
    schema: {
      allOf: [
        { $ref: getSchemaPath(PagedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ExpandedInterface) },
            },
          },
        },
      ],
    },
  })
  @ApiExtraModels(ExpandedInterface)
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'size', type: 'number' })
  getExpandedModels(
    @Query('page') page = 0,
    @Query('size') size = 100
  ): PagedResult<ExpandedInterface> {
    this.logger.log(`getExpandedModels`);
    return this.modelGraphService.getAllExpanded(page, size);
  }

  @Get('roots')
  @ApiOkResponse({
    description: 'Returns root models in their expanded representation.',
    type: [ExpandedInterface],
  })
  getRoots(): ExpandedInterface[] {
    this.logger.log(`getRoots`);
    return this.modelGraphService.getRoots();
  }

  @Get('/rootswithchildren')
  @ApiOkResponse({
    description:
      'Returns root models with their children in their expanded representation.',
    type: [InterfaceWithChildren],
  })
  getRootsWithChildren(): InterfaceWithChildren[] {
    this.logger.log(`getRootsWithChildren`);
    return this.modelGraphService.getRootsWithChildren();
  }

  @Get('/:dtmi/expand')
  @ApiOkResponse({
    description: 'Returns a model in its expanded representation.',
    type: [ExpandedInterface],
  })
  getExpanded(@Param('dtmi') dtmi: string): ExpandedInterface {
    this.logger.log(`getExpanded ${dtmi}`);
    return this.modelGraphService.getExpanded(dtmi);
  }

  @Get('/relationships/:sourceDtmi/:targetDtmi')
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

  @Get('/:dtmi')
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
