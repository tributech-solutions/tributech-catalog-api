import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  DEFAULT_FIELDS,
  getSchemaProperty,
  NAME_PROPERTY,
  SelectOption,
} from './common.model';

export const DEFAULT_FIELDS_TELEMETRY: (
  items: SelectOption[]
) => FormlyFieldConfig[] = (items: SelectOption[]) => [
  ...DEFAULT_FIELDS,
  NAME_PROPERTY,
  getSchemaProperty(items),
];
