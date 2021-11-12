import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DtdlModelsService, ExpandedInterface } from '@tributech/catalog-api';
import {
  ColumnSettings,
  TableNoDataHint,
  TablePaginationSettings,
} from '@tributech/core';
import { DigitalTwin, QueryService, TwinsService } from '@tributech/twin-api';
import { isString } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertDTMIToNeo4jLabel } from '../../utils/utils';

@Component({
  selector: 'tt-twin-instance-table',
  templateUrl: './twin-instance-table.component.html',
  styleUrls: ['./twin-instance-table.component.scss'],
})
export class TwinInstanceTableComponent implements OnInit {
  @Input() dtmi: string;
  @Output()
  instanceClicked: EventEmitter<DigitalTwin> = new EventEmitter<DigitalTwin>();

  columns: ColumnSettings[];
  rowData$: Observable<DigitalTwin[]>;
  pagination: TablePaginationSettings = {
    enablePagination: true,
    pageSize: 15,
    pageSizeOptions: [15, 25, 50, 100],
    showFirstLastButtons: true,
  };

  noDataHint: TableNoDataHint = {
    text: `You don't have any stored instances of this model yet.`,
    showGoToDocumentation: true,
  };

  constructor(
    private twinsService: TwinsService,
    private modelsService: DtdlModelsService,
    private queryService: QueryService
  ) {}

  ngOnInit() {
    if (!this.dtmi) return;
    const matchStmt = `(twin:${convertDTMIToNeo4jLabel(this.dtmi)})`;
    const withStmt = 'collect(distinct twin) AS nodes, [] AS relationships';
    this.rowData$ = this.queryService
      .getTwinGraphByCypherQuery(matchStmt, withStmt)
      .pipe(map((response) => response.digitalTwins));

    this.modelsService
      .getExpanded(this.dtmi)
      .pipe(map((r) => r as unknown as ExpandedInterface))
      .subscribe((expandedInterface) => {
        this.columns = [
          {
            displayName: '$dtId',
            propertyPath: '$dtId',
            filterDisabled: true,
          },
          {
            displayName: 'Self-Description',
            propertyPath: '$metadata.$model',
            filterDisabled: false,
            inferFilterData: true,
          },
          ...expandedInterface?.properties
            ?.filter((prop) => isString(prop.schema))
            .map((p) => ({
              displayName: p.displayName,
              propertyPath: p.name,
              filterDisabled: true,
            })),
        ];
      });
  }
}
