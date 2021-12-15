import { FormlyFieldConfig } from '@ngx-formly/core';
import { DEFAULT_FIELDS } from '../common.model';

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
      addText: 'Add another enum key',
    },
    fieldArray: {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-4',
          key: 'name',
          type: 'input',
          templateOptions: {
            label: 'Name',
            required: true,
          },
        },
        {
          className: 'col-4',
          key: 'displayName',
          type: 'input',
          templateOptions: {
            label: 'Display Name',
          },
        },
        {
          className: 'col-4',
          key: 'enumValue',
          type: 'input',
          templateOptions: {
            label: 'Enum Value',
            required: true,
          },
        },
      ],
    },
    expressionProperties: {
      'templateOptions.disabled': 'formState.disabled',
    },
  },
];
