import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata } from '@storybook/angular';
import { ColumnSettings, TableComponent, TableModule } from './table.module';

export default {
  title: 'Table',
  decorators: [
    moduleMetadata({
      imports: [TableModule, BrowserAnimationsModule],
    }),
  ],
};

const properties: { columns: ColumnSettings[]; rowData: any[] } = {
  columns: [
    {
      propertyPath: 'name.name',
      displayName: 'Name',
      inferFilterData: true,
    },
    {
      propertyPath: 'date',
      displayName: 'Date',
      filterDisabled: true,
    },
    {
      propertyPath: 'symbol',
      displayName: 'Symbol',
      disableSorting: true,
      availableOptions: [{ id: 'B', label: 'Manual set option B' }],
    },
  ],
  rowData: [
    { id: '1', name: { name: 'Hydrogen' }, date: '01/30/2017', symbol: 'H' },
    { id: '2', name: { name: 'Helium' }, date: '02/28/2018', symbol: 'He' },
    { id: '3', name: { name: 'Lithium' }, date: '01/30/2018', symbol: 'Li' },
    { id: '4', name: { name: 'Beryllium' }, date: '02/28/2017', symbol: 'Be' },
    {
      id: '5',
      name: { name: 'Boron' },
      date: 'Mar 16 2012 10:00:00               AM',
      symbol: 'B',
    },
    {
      id: '6',
      name: { name: 'Carbon' },
      date: 'Mar 17 2012 10:00:00               AM',
      symbol: 'C',
    },
    { id: '7', name: { name: 'Nitrogen' }, date: '01/15/2018', symbol: 'N' },
    {
      id: '8',
      name: { name: 'Oxygen' },
      date: 'Mar 19 2012 10:00:00               AM',
      symbol: 'O',
    },
    {
      id: '9',
      name: { name: 'Fluorine' },
      date: 'Mar 14 2012 10:00:00               AM',
      symbol: 'F',
    },
  ],
};

export const Default = () => ({
  component: TableComponent,
  props: {
    ...properties,
  },
});

export const WithSelection = () => ({
  component: TableComponent,
  props: {
    ...properties,
    selection: {
      multiSelect: false,
    },
  },
});

export const WithSelectionMulti = () => ({
  component: TableComponent,
  props: {
    ...properties,
    selection: {
      multiSelect: true,
    },
  },
});

export const WithSearch = () => ({
  component: TableComponent,
  props: {
    ...properties,
    showSearch: true,
  },
});

export const WithFilter = () => ({
  component: TableComponent,
  props: {
    ...properties,
    showSearch: true,
    showFilter: true,
  },
});
