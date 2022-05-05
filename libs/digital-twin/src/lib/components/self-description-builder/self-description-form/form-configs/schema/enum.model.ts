import { FormlyFieldConfig } from '@ngx-formly/core';
import { DEFAULT_FIELDS, DEFAULT_SCHEMA_FIELDS } from '../common.model';

export const DEFAULT_FIELDS_ENUM: FormlyFieldConfig[] = [
  ...DEFAULT_FIELDS,
  // enumValue array repeating section
  {
    type: 'select',
    key: 'valueSchema',
    templateOptions: {
      label: 'Schema',
      required: true,
      options: [
        { value: 'integer', label: 'integer' },
        { value: 'string', label: 'string' },
      ],
    },
  },
  {
    key: 'enumValues',
    type: 'repeat',
    templateOptions: {
      label: 'Enum Values',
      addText: 'Add another enum key',
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
        {
          key: 'enumValue',
          type: 'input',
          templateOptions: {
            label: 'Enum Value',
            required: true,
          },
        },
        ...DEFAULT_SCHEMA_FIELDS,
      ],
    },
    expressionProperties: {
      'templateOptions.disabled': 'formState.disabled',
    },
  },
];
