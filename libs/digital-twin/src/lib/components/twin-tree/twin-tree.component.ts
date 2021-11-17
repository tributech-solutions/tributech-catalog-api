import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  createEmptyTwin,
  ExpandedInterface,
  RelationType,
  TwinInstance,
  TwinRelationship,
} from '@tributech/self-description';
import { omit } from 'lodash';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ExportService } from '../../services/export.service';
import { LoadService } from '../../services/load.service';
import { ModelQuery } from '../../services/store/model.query';
import { ModelService } from '../../services/store/model.service';
import { RelationshipQuery } from '../../services/store/relationship.query';
import { RelationshipService } from '../../services/store/relationship.service';
import {
  EnrichedTwinTreeNode,
  TwinQuery,
  TwinTreeNode,
} from '../../services/store/twin.query';
import { TwinService } from '../../services/store/twin.service';
import { TwinBuilderService } from '../twin-instance-builder/twin-builder.service';

interface TwinFlatNode {
  expandable: boolean;
  twin: EnrichedTwinTreeNode;
  level: number;
}

@UntilDestroy()
@Component({
  selector: 'tt-twin-tree',
  templateUrl: './twin-tree.component.html',
  styleUrls: ['./twin-tree.component.scss'],
})
export class TwinTreeComponent implements OnInit {
  @Input() disableEditing: boolean;
  @Input() modelWhitelist: string[] = [];
  @Input() relationshipWhitelist: string[] = [];

  twins$ = this.twinQuery.selectAll();
  selectedTwin$: Observable<TwinInstance> =
    this.twinBuilderService.selectedTwin$;

  treeControl = new FlatTreeControl<TwinFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
    { trackBy: (dataNode) => dataNode?.twin?.$dtId as any }
  );

  treeFlattener = new MatTreeFlattener(
    (node: TwinTreeNode, level: number) => {
      return {
        expandable: !!node.children && node.children.length > 0,
        twin: node,
        level: level,
      };
    },
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  treeTracker = (index: number, node: TwinFlatNode) => node?.twin?.$dtId;
  hasChild = (_: number, node: TwinFlatNode) => node.expandable;

  constructor(
    private twinQuery: TwinQuery,
    private modelQuery: ModelQuery,
    private relationshipQuery: RelationshipQuery,
    private relationshipService: RelationshipService,
    private twinBuilderService: TwinBuilderService,
    private twinService: TwinService,
    private modelService: ModelService,
    private loadService: LoadService,
    private exportService: ExportService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.twinBuilderService.twinGraphChanged$
      .pipe(startWith(void 0), untilDestroyed(this))
      .subscribe(() => {
        this.updateTree();
      });
  }

  getRootModels() {
    return this.modelQuery.getRootModels();
  }

  getPossibleTargetTwins(modelId: string) {
    return this.modelQuery.getTwinGraphModelWithParents(modelId);
  }

  twinSelected(twin: TwinFlatNode) {
    this.twinBuilderService.selectTwin(
      omit(twin?.twin, ['modelMetadata$', 'children'])
    );
  }

  relationshipSelected(twin: TwinFlatNode) {
    const targetId = twin?.twin?.$dtId;
    const rels = this.relationshipQuery.getRelationshipsForTwin(
      targetId,
      RelationType.Target
    );
    this.twinBuilderService.selectRelationships(rels);
  }

  addTwin(model: ExpandedInterface) {
    const newTwin = createEmptyTwin(model?.['@id']);
    this.twinBuilderService.saveTwin(newTwin);
    this.twinBuilderService.selectTwin(newTwin);
  }

  deleteTwin(twin: TwinFlatNode) {
    this.twinBuilderService.deleteTwin(twin?.twin);
  }

  isActionEnabled(targetTwinModel: string, relType?: string) {
    if (!this.disableEditing) return true;

    if (!relType) {
      return this.modelWhitelist.includes(targetTwinModel);
    }

    return (
      this.modelWhitelist.includes(targetTwinModel) &&
      this.relationshipWhitelist.includes(relType)
    );
  }

  addTwinViaRelationship(
    rel: TwinRelationship,
    source: TwinInstance,
    target: ExpandedInterface
  ) {
    const newTwin = createEmptyTwin(target?.['@id']);
    this.twinBuilderService.addTwinViaRelation(source, rel?.name, newTwin);
  }

  importViaFile() {
    this.twinBuilderService.clearLoadedTwins();
    this.loadService.loadExternalTwinFile();
  }

  importViaText() {
    this.loadService.loadFromDialog();
  }

  exportToFile() {
    this.exportService.exportToFile();
  }

  clearGraph() {
    this.twinBuilderService.clearLoadedTwins();
  }

  private updateTree() {
    this.dataSource.data = this.twinQuery.getTwinsAsTreeWithMetadata();
    this.changeDetectorRef.markForCheck();
  }
}
