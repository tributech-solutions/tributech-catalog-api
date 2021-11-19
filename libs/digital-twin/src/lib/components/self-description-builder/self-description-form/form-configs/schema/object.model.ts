import { FormlyFieldConfig } from '@ngx-formly/core';
import { DEFAULT_FIELDS } from '../common.model';

export const DEFAULT_FIELDS_OBJECT: FormlyFieldConfig[] = [
  ...DEFAULT_FIELDS,
  // fields repeating section
];
