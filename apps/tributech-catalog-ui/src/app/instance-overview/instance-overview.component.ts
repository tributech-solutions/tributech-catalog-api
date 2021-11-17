import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filterNil } from '@datorama/akita';
import {
  ColumnSettings,
  TableNoDataHint,
  TablePaginationSettings,
  TwinBuilderService,
} from '@tributech/digital-twin';
import { DigitalTwin, TwinsService } from '@tributech/twin-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tributech-instance-overview',
  templateUrl: './instance-overview.component.html',
  styleUrls: ['./instance-overview.component.scss'],
})
export class InstanceOverviewComponent implements OnInit {
  columns: ColumnSettings[];
  rowData$: Observable<DigitalTwin[]>;
  pagination: TablePaginationSettings = {
    enablePagination: true,
    pageSize: 15,
    pageSizeOptions: [15, 25, 50, 100],
    showFirstLastButtons: true,
  };

  noDataHint: TableNoDataHint = {
    text: `You don't have any twin instances stored yet.`,
  };

  constructor(
    private twinService: TwinsService,
    private router: Router,
    private twinBuilderService: TwinBuilderService
  ) {}

  ngOnInit() {
    this.rowData$ = this.twinService.getAllTwins(1, 100).pipe(
      map((pagedResult) => pagedResult.content),
      filterNil
    );

    this.columns = [
      {
        displayName: 'DTID',
        propertyPath: '$dtId',
        filterDisabled: true,
      },
      {
        displayName: 'Self-Description',
        propertyPath: '$metadata.$model',
        filterDisabled: false,
        inferFilterData: true,
      },
    ];
  }

  goToDetails(dtId: string) {
    if (!dtId) return;
    this.router.navigate(['/workspace']).then(() => {
      this.twinBuilderService.clearAndLoad(dtId);
    });
  }
}
