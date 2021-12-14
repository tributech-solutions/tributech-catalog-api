import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  ITreeOptions,
  TreeComponent,
  TreeNode,
} from '@circlon/angular-tree-component';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  createEmptyTwin,
  ExpandedInterface,
  RelationType,
  SelfDescription,
  TwinInstance,
  TwinRelationship,
} from '@tributech/self-description';
import { omit } from 'lodash';
import { ExportService } from '../../../services/export.service';
import { LoadService } from '../../../services/load.service';
import { RelationshipQuery } from '../../../services/store/relationship/relationship.query';
import { SelfDescriptionQuery } from '../../../services/store/self-description/self-description.query';
import { TwinQuery } from '../../../services/store/twin-instance/twin.query';
import { TwinBuilderService } from '../twin-builder.service';

type TwinInstanceTreeNode = { data: TwinInstance } & TreeNode;
export interface CreateNewTwinInstancePayload {
  twin: TwinInstance;
  relationship?: TwinRelationship;
}

@UntilDestroy()
@Component({
  selector: 'tt-twin-tree',
  templateUrl: './twin-tree.component.html',
  styleUrls: ['./twin-tree.component.scss'],
})
export class TwinTreeComponent {
  @Input() disableEditing: boolean;
  @Input() modelWhitelist: string[] = [];
  @Input() relationshipWhitelist: string[] = [];

  @Output() twinSelected = new EventEmitter<TwinInstance>();
  @Output() relationshipSelected = new EventEmitter<TwinRelationship[]>();
  @Output() twinCreated = new EventEmitter<CreateNewTwinInstancePayload>();

  @ViewChild('trigger', { read: MatMenuTrigger })
  contextMenu: MatMenuTrigger;

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  twins$ = this.twinQuery.treeData$;
  outgoingRelationships: TwinRelationship[] = [];
  contextMenuPosition = { x: '0px', y: '0px' };
  options: ITreeOptions = {
    idField: '$dtId',
    displayField: 'Name',
    getChildren: this.getChildren.bind(this),
    useVirtualScroll: true,
  };

  get contextTwin() {
    return this.contextMenu?.menuData?.item as TwinInstance;
  }

  constructor(
    private twinQuery: TwinQuery,
    private selfDescriptionQuery: SelfDescriptionQuery,
    private relationshipQuery: RelationshipQuery,
    private twinBuilderService: TwinBuilderService,
    private loadService: LoadService,
    private exportService: ExportService
  ) {}

  onContextMenu(event: MouseEvent, item: SelfDescription) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();

    this.outgoingRelationships = this.getPossibleOutgoingRelationships();
  }

  getRootModels() {
    return this.selfDescriptionQuery.getRootModels();
  }

  getPossibleTargetTwins(modelId: string) {
    return this.selfDescriptionQuery.getTwinGraphModelWithParents(modelId);
  }

  _twinSelected(twin: TwinInstance) {
    this.twinSelected.emit(twin);
    this.twinBuilderService.selectTwin(
      omit(twin, ['children', 'hasChildren', '$modelMetadata'])
    );
  }

  _relationshipsSelected(twin: TwinInstance) {
    const targetId = twin?.$dtId;
    if (!targetId) return;
    const rels = this.relationshipQuery.getRelationshipsForTwin(
      targetId,
      RelationType.Target
    );
    if (rels?.length === 0) return;
    this.twinBuilderService.selectRelationships(rels);
    this.relationshipSelected.emit(rels);
  }

  async addTwin(model: ExpandedInterface) {
    const newTwin = createEmptyTwin(model?.['@id']);
    await this.twinBuilderService.saveTwin(newTwin);
    this.twinBuilderService.selectTwin(newTwin);
    this.tree.treeModel.update();
  }

  async deleteTwin(twin: TwinInstance) {
    await this.twinBuilderService.deleteTwin(twin);
    this.tree.treeModel.update();
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

  async addTwinViaRelationship(
    rel: TwinRelationship,
    source: TwinInstance,
    target: ExpandedInterface
  ) {
    const newTwin = createEmptyTwin(target?.['@id']);
    await this.twinBuilderService.addTwinViaRelation(
      source,
      rel?.name,
      newTwin
    );
    this.tree.treeModel.update();
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
    this.tree.treeModel.update();
  }

  private getPossibleOutgoingRelationships() {
    if (!this.contextTwin?.$metadata?.$model) return [];
    return this.selfDescriptionQuery.getTwinGraphModel(
      this.contextTwin?.$metadata?.$model
    )?.relationships;
  }

  private getChildren(node: TwinInstanceTreeNode) {
    return [...this.twinQuery.getChildren(node.data)];
  }
}
