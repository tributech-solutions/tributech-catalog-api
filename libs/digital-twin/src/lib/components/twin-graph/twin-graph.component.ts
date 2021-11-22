import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClusterNode, Edge, GraphComponent, Node } from '@swimlane/ngx-graph';
import {
  ExpandedInterface,
  TwinInstance,
  TwinRelationship,
} from '@tributech/self-description';
import { groupBy } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RelationshipQuery } from '../../services/store/relationship.query';
import { TwinQuery } from '../../services/store/twin.query';

@UntilDestroy()
@Component({
  selector: 'tt-twin-graph',
  templateUrl: './twin-graph.component.html',
  styleUrls: ['./twin-graph.component.scss'],
})
export class TwinGraphComponent implements OnInit, OnDestroy {
  @Output() twinSelected = new EventEmitter<TwinInstance>();

  @ViewChild('twinGraph') twinGraph: GraphComponent;

  relationships: Edge[] = [];
  nodes: Node[] = [];
  groups: ClusterNode[] = [];

  size: [number, number] = null;
  showCluster = false;
  centerGraphSubject = new Subject<void>();
  graphSize = new Subject<[number, number]>();

  constructor(
    private twinQuery: TwinQuery,
    private relationshipQuery: RelationshipQuery
  ) {}

  ngOnInit(): void {
    this.twinQuery
      .selectAll()
      .pipe(untilDestroyed(this))
      .subscribe((twins) => {
        this.nodes = this.mapToNodes(twins);
        this.groups = this.mapToClusters(twins);
      });

    this.relationshipQuery
      .selectAll()
      .pipe(untilDestroyed(this))
      .subscribe((rels) => {
        this.relationships = this.mapToEdges(rels);
      });

    this.graphSize
      .pipe(debounceTime(150), untilDestroyed(this))
      .subscribe((size) => (this.size = size));
  }

  ngOnDestroy(): void {
    this.centerGraphSubject.complete();
  }

  onResize(resizeEvent: ResizeObserverEntry[]) {
    const event = resizeEvent?.pop();
    this.graphSize.next([
      event?.contentRect?.width,
      event?.contentRect?.height,
    ]);
  }

  _twinSelected(twin: { twin: TwinInstance | ExpandedInterface }) {
    this.twinSelected.emit(twin?.twin);
  }

  centerGraph() {
    this.centerGraphSubject.next();
  }

  private mapToNodes(twins: TwinInstance[]): Node[] {
    return twins.map((twin) => ({
      id: twin?.$dtId,
      label: twin?.Name || twin?.$dtId,
      type: twin?.$metadata?.$model,
      twin,
    }));
  }

  private mapToEdges(relationships: TwinRelationship): Edge[] {
    return relationships.map((rel) => ({
      id: rel?.$dtId,
      label: rel?.$relationshipName,
      source: rel?.$sourceId,
      target: rel?.$targetId,
      rel,
    }));
  }

  private mapToClusters(twins: TwinInstance[]): ClusterNode[] {
    const groups = groupBy(twins, (twin) => twin?.$metadata?.$model);

    return Object.entries(groups).map(([modelType, twinGroup]) => ({
      id: modelType,
      label: modelType,
      childNodeIds: twinGroup.map((twin) => twin?.$dtId),
    }));
  }
}
