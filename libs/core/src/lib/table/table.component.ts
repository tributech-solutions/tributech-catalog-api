import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { cloneDeep } from '@apollo/client/utilities';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map as _map, some } from 'lodash';
import { ConfigService } from '../config/config.service';
import { getInPath } from '../utils/get-by-path';
import {
  ColumnSettings,
  TableNoDataHint,
  TablePaginationSettings,
  TableSelectionSettings,
} from './table-settings.model';

@UntilDestroy()
@Component({
  selector: 'tt-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TableComponent<T extends { id: string } = { id: string }>
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() rowData: T[];
  @Input() dataSource: MatTableDataSource<T>;

  @Input() columns: ColumnSettings[];
  @Input() pagination?: TablePaginationSettings;
  @Input() selection?: TableSelectionSettings<T>;

  @Input() showSearch: boolean;
  @Input() showFilter: boolean;
  @Input() expandable: boolean;
  @Input() noDataHint: TableNoDataHint;

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ContentChild(TemplateRef) expansionTemplate;
  @Output()
  selectionChanged = new EventEmitter<T[]>();
  @Output() rowClicked = new EventEmitter<T>();

  getInPath = getInPath;
  expandedElement: T | null;

  get clientSide() {
    return !!this.rowData;
  }

  type: string;
  selectedRowIndex = '';
  _selection = new SelectionModel<T>();
  columnNames: string[] = [];
  documentationLink: string;

  constructor(private configService: ConfigService) {
    this.documentationLink = this.configService?.endpoints?.documentationUrl;
  }

  ngOnInit() {
    this.columnNames = _map(this.columns, 'propertyPath');

    if (this.selection) {
      // Setting selection model
      this._selection = new SelectionModel<T>(
        this.selection?.multiSelect,
        this.selection?.initialRowSelection ?? [],
        true
      );
      this._selection.changed.pipe(untilDestroyed(this)).subscribe(() => {
        this.selectionChanged.emit(this._selection.selected);
      });
    }

    this.setupDatasource();
    this.dataChanged();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.dataSource) return;
    if (!changes.rowData) return;
    this.dataChanged();
  }

  _rowClicked(row: T, event?: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!row || this.shouldIgnoreClick(event)) return;
    this.expandedElement = this.expandedElement === row ? null : row;
    this.selectedRowIndex = row?.id;
    this.rowClicked.emit(row);
    this._rowSelected(row);
  }

  _rowSelected(row: T, event?: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!this.selection) return;
    this._selection.toggle(row);
  }

  private setupDatasource() {
    this.dataSource = new MatTableDataSource(this.rowData);
    this.dataSource.filterPredicate = (data: T, _filter: string): boolean => {
      const filterObject = JSON.parse(_filter);
      const filterTerm = filterObject?.searchTerm;
      const objectFilters = cloneDeep(filterObject);
      delete objectFilters.searchTerm;

      function nameFilterMatches(data: T, term: string) {
        function nestedFilterCheck(search, data, key) {
          if (typeof data[key] === 'object') {
            for (const k in data[key]) {
              if (data[key][k] !== null) {
                search = nestedFilterCheck(search, data[key], k);
              }
            }
          } else {
            search += data[key];
          }
          return search;
        }

        const accumulator = (currentTerm, key) => {
          return nestedFilterCheck(currentTerm, data, key);
        };

        const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
        // Transform the filter by converting it to lowercase and removing whitespace.
        const transformedFilter = filterTerm.trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
      }
      function optionFilterMatches(data: T, filterObject: any) {
        if (!filterObject || Object.keys(filterObject).length === 0) {
          return true;
        }
        let allObjectFilterMatch = true;
        for (const key in filterObject) {
          const searchValues = filterObject[key]
            ?.trim()
            .toLowerCase()
            .split('◬');
          const rowValue = getInPath(data, key)
            ?.toString()
            .trim()
            .toLowerCase();
          if (!searchValues.includes(rowValue)) {
            allObjectFilterMatch = false;
          }
        }
        return allObjectFilterMatch;
      }

      return (
        optionFilterMatches(data, objectFilters) &&
        nameFilterMatches(data, filterTerm)
      );
    };

    this.dataSource.sortingDataAccessor = (
      data: T,
      sortHeaderId: string
    ): string | number => {
      const propPath = sortHeaderId.split('.');
      const value: any = propPath.reduce(
        (curObj, property) => curObj[property],
        data
      );
      return !isNaN(value) ? Number(value) : value;
    };
  }

  private dataChanged() {
    this.dataSource.data = this.rowData || [];

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private shouldIgnoreClick(event: PointerEvent | MouseEvent) {
    return some((event as any)?.path, (path) => {
      return path.classList?.contains('action-cell') ?? false;
    });
  }
}
