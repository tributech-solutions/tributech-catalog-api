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
];
