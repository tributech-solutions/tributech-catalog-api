import { TemplateRef } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface TableSelectionSettings<T = unknown> {
  showCheckboxes: boolean;
  multiSelect: boolean;
  initialRowSelection: T[];
}

export interface TablePaginationSettings {
  /**
   * @description enable Pagination of rows
   */
  enablePagination: boolean;
  /**
   * @description Number of items to display on a page. By default, set to 50.
   */
  pageSize: number;
  /**
   * @description the set of provided page size options to display to the user.
   */
  pageSizeOptions: number[];
  /**
   * @description Whether to show the first/last buttons UI to the user.
   */
  showFirstLastButtons: boolean;
}

export type ColumnSettings =
  | BasicColumn
  | TemplateColumn
  | ActionColumn
  | ButtonColumn
  | DateColumn;

export enum ColumnType {
  STRING = 'string',
  TEMPLATE = 'template',
  SELECT = 'actions',
  DATE = 'date',
  BUTTON = 'button',
}

export interface BasicColumn<T = never> {
  colId?: string;

  /**
   * Part to the property that should be displayed
   * Can be propertyName or part in dot notation
   */
  propertyPath?: string;

  getter?(row: T): string | number;

  /**
   * The column name to be displayed
   */
  displayName: string;

  /**
   * Column type - defaults to string
   */
  type?: ColumnType;

  disableSorting?: boolean;
  filterDisabled?: boolean;
  /**
   * If filtering is activated the available options
   * will be inferred by the available data if this flag is set
   */
  inferFilterData?: boolean;
}

export interface TemplateColumn extends BasicColumn {
  template?: TemplateRef<unknown>;
}

export interface ActionColumn extends BasicColumn {
  actions?: TableAction[];
}

export interface ButtonColumn<T = unknown> extends BasicColumn {
  buttonLabel?: string;
  callback: (row: T) => void;
}

export interface DateColumn extends BasicColumn {
  format?: string;
  subtractOneDay?: boolean;
}

export interface TableAction<T = unknown> {
  label: string;
  icon: IconDefinition;
  callback: (row: T) => void;
}

export interface TableNoDataHint {
  text: string;
  routerLink?: string[];
}
