import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Edge, Node } from '@swimlane/ngx-graph';
import { uniqBy } from 'lodash';
import { debounceTime } from 'rxjs/operators';

export interface LegendChanged {
  selectedNodeIds: string[];
  selectedEdgeNames: string[];
}

@UntilDestroy()
@Component({
  selector: 'tt-graph-legend',
  templateUrl: './graph-legend.component.html',
  styleUrls: ['./graph-legend.component.scss'],
})
export class GraphLegendComponent implements OnInit, OnChanges {
  @Input() edges: Edge[] = [];
  @Input() nodes: Node[] = [];
  @Output() selectionChanged = new EventEmitter<LegendChanged>();

  uniqueNodes: Node[] = [];
  uniqueEdges: Edge[] = [];

  @ViewChild('nodeList', { static: true }) nodeList: MatSelectionList;
  @ViewChild('edgeList', { static: true }) edgeList: MatSelectionList;

  ngOnInit(): void {
    this.nodeList.selectionChange
      .pipe(debounceTime(100))
      .subscribe(() => this._selectionChanged());

    this.edgeList.selectionChange
      .pipe(debounceTime(100))
      .subscribe(() => this._selectionChanged());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.uniqueNodes = uniqBy(this.nodes, 'id');
    this.uniqueEdges = uniqBy(this.edges, 'label');
    setTimeout(() => {
      this.edgeList.selectAll();
      this.nodeList.selectAll();
      this._selectionChanged();
    });
  }

  _selectionChanged() {
    const selectedNodes: string[] = this.nodeList.selectedOptions.selected.map(
      (o) => o?.value?.id
    );
    const selectedEdges: string[] = this.edgeList.selectedOptions.selected.map(
      (o) => o?.value?.label
    );
    this.selectionChanged.emit({
      selectedNodeIds: selectedNodes,
      selectedEdgeNames: selectedEdges,
    });
  }
}
