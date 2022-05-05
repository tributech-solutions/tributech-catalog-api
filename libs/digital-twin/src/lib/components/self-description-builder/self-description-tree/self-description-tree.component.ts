import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  ITreeOptions,
  TreeComponent,
  TreeNode,
} from '@circlon/angular-tree-component';
import {
  isInterfaceSD,
  SelfDescription,
  SelfDescriptionType,
} from '@tributech/self-description';
import { Observable } from 'rxjs';
import { ExportService } from '../../../services/export.service';
import { ensureIDPresent } from '../../../services/store/self-description/self-description.normalizer';
import { SelfDescriptionQuery } from '../../../services/store/self-description/self-description.query';
import {
  ChildLinkTarget,
  SelfDescriptionService,
} from '../../../services/store/self-description/self-description.service';
import { UtilsService } from '../../../services/utils.service';
import { SelfDescriptionFormService } from '../self-description-form.service';

type SelfDescriptionTreeNode = { data: SelfDescription } & TreeNode;

export interface CreateNewSelfDescriptionPayload {
  sd: SelfDescription;
  anchorSD: SelfDescription;
  targetProp: ChildLinkTarget;
}

@Component({
  selector: 'tt-self-description-tree',
  templateUrl: './self-description-tree.component.html',
  styleUrls: ['./self-description-tree.component.scss'],
})
export class SelfDescriptionTreeComponent {
  @Output() sdSelected = new EventEmitter<SelfDescription>();
  @Output() sdCreated = new EventEmitter<CreateNewSelfDescriptionPayload>();

  selfDescriptions$: Observable<SelfDescription[]> =
    this.selfDescriptionQuery.treeData$;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild(TreeComponent) private tree: TreeComponent;

  contextMenuPosition = { x: '0px', y: '0px' };
  SelfDescriptionType = SelfDescriptionType;
  options: ITreeOptions = {
    idField: '@id',
    displayField: '@id',
    getChildren: this.getChildren.bind(this),
    useVirtualScroll: true,
  };

  constructor(
    private selfDescriptionQuery: SelfDescriptionQuery,
    private selfDescriptionService: SelfDescriptionService,
    private selfDescriptionFormService: SelfDescriptionFormService,
    private utilService: UtilsService,
    private exportService: ExportService
  ) {}

  getChildren(node: SelfDescriptionTreeNode) {
    return [
      ...this.selfDescriptionQuery.getContents(node.data),
      ...this.selfDescriptionQuery.getSchemas(node.data),
    ];
  }

  onContextMenu(event: MouseEvent, item: SelfDescription) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  createNewContent(type: SelfDescriptionType) {
    const newSd =
      this.selfDescriptionFormService.createEmptySelfDescription(type);
    this.sdCreated.emit({
      anchorSD: this.contextMenu.menuData?.item,
      sd: ensureIDPresent(newSd, this.contextMenu.menuData?.item?.['@id']),
      targetProp: ChildLinkTarget.CONTENTS,
    });
    this.tree.treeModel.update();
  }

  createNewSchema(type: SelfDescriptionType) {
    const newSd =
      this.selfDescriptionFormService.createEmptySelfDescription(type);
    this.sdCreated.emit({
      anchorSD: this.contextMenu.menuData?.item,
      sd: ensureIDPresent(newSd, this.contextMenu.menuData?.item?.['@id']),
      targetProp: ChildLinkTarget.SCHEMAS,
    });
    this.tree.treeModel.update();
  }

  createNewInterface() {
    const newSd = this.selfDescriptionFormService.createEmptySelfDescription(
      SelfDescriptionType.Interface
    );
    this.sdCreated.emit({
      anchorSD: null,
      sd: newSd,
      targetProp: null,
    });
  }

  canAddContent() {
    if (!this.contextMenu?.menuData?.item) return false;
    return isInterfaceSD(this.contextMenu?.menuData?.item);
  }

  canExport() {
    if (!this.contextMenu?.menuData?.item) return false;
    return isInterfaceSD(this.contextMenu?.menuData?.item);
  }

  exportAsFile() {
    this.exportService.downloadObjectAsJson(
      this.selfDescriptionQuery.getDenormalized(
        this.contextMenu?.menuData?.item?.['@id']
      ),
      'exported-twin'
    );
  }

  exportToClipboard() {
    this.utilService.copyToClipboard(
      this.selfDescriptionQuery.getDenormalized(
        this.contextMenu?.menuData?.item?.['@id']
      ),
      true
    );
  }
}
