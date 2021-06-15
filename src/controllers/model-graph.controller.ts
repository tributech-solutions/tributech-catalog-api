import { Controller, Get, Logger, Param } from '@nestjs/common';
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

  @Get(':dtmi')
  getModel(@Param('dtmi') dtmi: string): Interface {
    this.logger.log(`getModel ${dtmi}`);
    return this.modelService.get(dtmi)?.model;
  }

  @Get('/expanded')
  getExpandedModels(): ExpandedInterface[] {
    this.logger.log(`getExpandedModels`);
    return this.modelGraphService.getAllExpanded();
  }

  @Get('/roots')
  getRoots(): ExpandedInterface[] {
    this.logger.log(`getRoots`);
    return this.modelGraphService.getRoots();
  }

  @Get('/rootswithchildren')
  getRootsWithChildren(): InterfaceWithChildren[] {
    this.logger.log(`getRootsWithChildren`);
    return this.modelGraphService.getRootsWithChildren();
  }

  @Get(':dtmi/expanded')
  getExpanded(@Param('dtmi') dtmi: string): ExpandedInterface {
    this.logger.log(`getExpanded ${dtmi}`);
    return this.modelGraphService.getExpanded(dtmi);
  }

  @Get(':dtmi/expanded/parents')
  getExpandedWithParents(@Param('dtmi') dtmi: string): ExpandedInterface[] {
    this.logger.log(`getExpandedWithParents ${dtmi}`);
    return this.modelGraphService.getExpandedWithParents(dtmi);
  }

  @Get(':sourceDtmi/:targetDtmi')
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
}
