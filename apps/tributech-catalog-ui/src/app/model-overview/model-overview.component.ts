import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { filterNil } from '@datorama/akita';
import { faHardHat } from '@fortawesome/free-solid-svg-icons';
import { ManageModelsService, ModelEntity } from '@tributech/catalog-api';
import {
  ColumnSettings,
  ColumnType,
  TableNoDataHint,
  TablePaginationSettings,
} from '@tributech/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tributech-model-overview',
  templateUrl: './model-overview.component.html',
  styleUrls: ['./model-overview.component.scss'],
})
export class ModelOverviewComponent implements OnInit {
  @ViewChild('activeCol', { static: true }) activeCol: TemplateRef<any>;

  faHardHat = faHardHat;
  columns: ColumnSettings[];
  rowData$: Observable<ModelEntity[]>;
  pagination: TablePaginationSettings = {
    enablePagination: true,
    pageSize: 15,
    pageSizeOptions: [15, 25, 50, 100],
    showFirstLastButtons: true,
  };

  noDataHint: TableNoDataHint = {
    text: `You don't have any models stored yet.`,
    showGoToDocumentation: true,
  };

  constructor(
    private manageService: ManageModelsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.rowData$ = this.manageService.getAllEntities(100, 0).pipe(
      map((pagedResult) => pagedResult.data),
      filterNil
    );

    this.columns = [
      {
        displayName: 'DTMI',
        propertyPath: 'model.@id',
        filterDisabled: true,
      },
      {
        displayName: 'Name',
        propertyPath: 'model.displayName',
        filterDisabled: true,
      },
      {
        displayName: 'Active',
        propertyPath: 'active',
        type: ColumnType.TEMPLATE,
        template: this.activeCol,
        filterDisabled: false,
        inferFilterData: true,
      },
    ];
  }

  goToDetails(dtmi: string) {
    if (!dtmi) return;
    this.router.navigate(['/self-descriptions', dtmi]);
  }
}
