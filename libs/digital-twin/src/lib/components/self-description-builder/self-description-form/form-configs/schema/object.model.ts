import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  DEFAULT_FIELDS,
  DEFAULT_SCHEMA_FIELDS,
  getSchemaProperty,
  SelectOption,
} from '../common.model';

export const DEFAULT_FIELDS_OBJECT: (
  items: SelectOption[]
) => FormlyFieldConfig[] = (items) => [
  ...DEFAULT_FIELDS,
  {
    key: 'fields',
    type: 'repeat',
    templateOptions: {
      addText: 'Add another field',
      label: 'Fields',
    },
    fieldArray: {
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          templateOptions: {
            label: 'Name',
            required: true,
          },
        },
        getSchemaProperty(items, 'schema'),
        ...DEFAULT_SCHEMA_FIELDS,
      ],
    },
    expressionProperties: {
      'templateOptions.disabled': 'formState.disabled',
    },
  },
];
