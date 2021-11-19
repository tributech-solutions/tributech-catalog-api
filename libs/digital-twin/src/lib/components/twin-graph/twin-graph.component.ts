import {
  Component,
  EventEmitter,
  Input,
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
import { DialogService } from '../../other-components/dynamic-dialog/dialog.service';
import { ModelQuery } from '../../services/store/model.query';
import { RelationshipQuery } from '../../services/store/relationship.query';
import { TwinQuery } from '../../services/store/twin.query';

export enum GraphMode {
  TWINS = 'TWINS',
  MODELS = 'MODELS',
}

@UntilDestroy()
@Component({
  selector: 'tt-twin-graph',
  templateUrl: './twin-graph.component.html',
  styleUrls: ['./twin-graph.component.scss'],
})
export class TwinGraphComponent implements OnInit, OnDestroy {
  @Input() mode: GraphMode = GraphMode.TWINS;
  @Input() disableToggle: boolean;
  @Output() twinSelected = new EventEmitter<TwinInstance>();
  @Output() modelSelected = new EventEmitter<ExpandedInterface>();

  @ViewChild('twinGraph') twinGraph: GraphComponent;

  relationships: Edge[] = [];
  nodes: Node[] = [];
  groups: ClusterNode[] = [];

  relationshipModels: Edge[] = [];
  nodeModels: Node[] = [];

  size: [number, number] = null;
  showCluster = false;
  GraphMode = GraphMode;
  centerGraphSubject = new Subject<void>();
  graphSize = new Subject<[number, number]>();

  constructor(
    private twinQuery: TwinQuery,
    private relationshipQuery: RelationshipQuery,
    private modelQuery: ModelQuery,
    private dialogService: DialogService
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

    this.modelQuery
      .selectAll()
      .pipe(debounceTime(100), untilDestroyed(this))
      .subscribe(() => {
        const ref = this.dialogService.openLoadingModal(
          'Building model graph...'
        );
        const [nodes, edges] = this.generateModelGraph(
          this.modelQuery.getTwinGraphModels()
        );
        this.nodeModels = nodes;
        this.relationshipModels = edges;
        ref.close();
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
    if (this.mode === GraphMode.MODELS) {
      this.modelSelected.emit(twin?.twin as ExpandedInterface);
      return;
    }
    this.twinSelected.emit(twin?.twin);
  }

  centerGraph() {
    this.centerGraphSubject.next();
  }

  private generateModelGraph(twins: ExpandedInterface[]): [Node[], Edge[]] {
    const nodes = twins.map((twin) => ({
      id: twin?.['@id'],
      label: twin?.displayName || twin?.['@id'],
      twin,
    }));

    const relationships = twins.reduce(
      (curr, parent) => [
        ...curr,
        ...parent?.relationships.map(
          (rel) =>
            ({
              id: rel?.['@id'],
              label: rel?.name,
              source: parent['@id'],
              target: rel?.target,
              rel,
            } as Edge)
        ),
      ],
      [] as Edge[]
    );

    const inheritanceRels = twins
      .filter((t) => t?.bases?.length !== 0)
      .map(
        (twin) =>
          ({
            label: 'Extends',
            source: twin?.bases?.shift(),
            target: twin?.['@id'],
          } as Edge)
      );

    return [nodes, [...relationships, ...inheritanceRels]];
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
