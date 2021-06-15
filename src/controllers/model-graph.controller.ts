import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  InterfaceWithChildren,
  ModelGraphService,
} from '../model/model-graph.service';
import { ModelService } from '../model/model.service';
import { ExpandedInterface, Interface, Relationship } from '../models/models';

@ApiTags('models')
@Controller('graph')
export class ModelGraphController {
  private readonly logger = new Logger(ModelGraphController.name);

  constructor(
    private readonly modelService: ModelService,
    private readonly modelGraphService: ModelGraphService
  ) {}

  @Get('/expanded')
  getExpandedModels(): ExpandedInterface[] {
    this.logger.log(`getExpandedModels`);
    return this.modelGraphService.getAllExpanded();
  }

  @Get('roots')
  getRoots(): ExpandedInterface[] {
    this.logger.log(`getRoots`);
    return this.modelGraphService.getRoots();
  }

  @Get('/rootswithchildren')
  getRootsWithChildren(): InterfaceWithChildren[] {
    this.logger.log(`getRootsWithChildren`);
    return this.modelGraphService.getRootsWithChildren();
  }

  @Get('/:dtmi/expand')
  getExpanded(@Param('dtmi') dtmi: string): ExpandedInterface {
    this.logger.log(`getExpanded ${dtmi}`);
    return this.modelGraphService.getExpanded(dtmi);
  }

  @Get('/:dtmi/expand/parents')
  getExpandedWithParents(@Param('dtmi') dtmi: string): ExpandedInterface[] {
    this.logger.log(`getExpandedWithParents ${dtmi}`);
    return this.modelGraphService.getExpandedWithParents(dtmi);
  }

  @Get('/:sourceDtmi/:targetDtmi')
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
  getModel(@Param('dtmi') dtmi: string): Interface {
    this.logger.log(`getModel ${dtmi}`);
    const expandedModel = this.modelService.get(dtmi);
    if (!expandedModel || !expandedModel?.model) {
      throw new NotFoundException('Model not found');
    }
    return expandedModel?.model;
  }
}
