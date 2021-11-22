import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Edge, GraphComponent, Node } from '@swimlane/ngx-graph';
import { ExpandedInterface, TwinInstance } from '@tributech/self-description';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DialogService } from '../../other-components/dynamic-dialog/dialog.service';
import { ModelQuery } from '../../services/store/model.query';
import { LegendChanged } from './graph-legend/graph-legend.component';

@UntilDestroy()
@Component({
  selector: 'tt-self-description-graph',
  templateUrl: './self-description-graph.component.html',
  styleUrls: ['./self-description-graph.component.scss'],
})
export class SelfDescriptionGraphComponent implements OnInit, OnDestroy {
  @Output() modelSelected = new EventEmitter<ExpandedInterface>();

  @ViewChild('twinGraph') twinGraph: GraphComponent;

  relationshipModels: Edge[] = [];
  nodeModels: Node[] = [];

  visibleNodes: Node[] = [];
  visibleEdges: Edge[] = [];

  size: [number, number] = null;
  centerGraphSubject = new Subject<void>();
  graphSize = new Subject<[number, number]>();

  constructor(
    private modelQuery: ModelQuery,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
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
    this.modelSelected.emit(twin?.twin as ExpandedInterface);
  }

  centerGraph() {
    this.centerGraphSubject.next();
  }

  legendChanged(legendChanged: LegendChanged) {
    this.visibleNodes = [
      ...this.nodeModels.filter((node) =>
        legendChanged.selectedNodeIds.includes(node?.id)
      ),
    ];
    this.visibleEdges = [
      ...this.relationshipModels
        .filter((edge) => legendChanged.selectedEdgeNames.includes(edge?.label))
        .filter(
          (edge) =>
            legendChanged.selectedNodeIds.includes(edge.source) &&
            legendChanged.selectedNodeIds.includes(edge.target)
        ),
    ];
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

    return [nodes, [...inheritanceRels, ...relationships]];
  }
}
