import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  DEFAULT_FIELDS,
  DEFAULT_SCHEMA_FIELDS,
  getSchemaProperty,
  SelectOption,
} from '../common.model';

export const DEFAULT_FIELDS_MAP: (
  items: SelectOption[]
) => FormlyFieldConfig[] = (items) => [
  ...DEFAULT_FIELDS,
  {
    key: 'mapKey',
    wrappers: ['panel'],
    templateOptions: {
      label: 'Map Key',
      required: true,
      maxLength: 64,
    },
    fieldGroup: [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          required: true,
          type: 'text',
          label: 'Name',
        },
      },
      {
        key: 'schema',
        type: 'input',
        defaultValue: 'string',
        templateOptions: {
          required: true,
          readonly: true,
          type: 'text',
          label: 'Schema',
        },
      },
      ...DEFAULT_SCHEMA_FIELDS,
    ],
  },
  {
    key: 'mapValue',
    wrappers: ['panel'],
    templateOptions: {
      label: 'Map Value',
      required: true,
      maxLength: 64,
    },
    fieldGroup: [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          required: true,
          type: 'text',
          label: 'Name',
        },
      },
      getSchemaProperty(items, 'schema'),
      ...DEFAULT_SCHEMA_FIELDS,
    ],
  },
];
