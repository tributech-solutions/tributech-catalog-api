import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  DEFAULT_FIELDS,
  NAME_PROPERTY,
  SelectOption,
  WRITABLE_PROPERTY,
} from './common.model';

export const DEFAULT_FIELDS_RELATIONSHIP: (
  items: SelectOption[]
) => FormlyFieldConfig[] = (items: SelectOption[]) => [
  ...DEFAULT_FIELDS,
  NAME_PROPERTY,
  {
    type: 'input',
    key: 'maxMultiplicity',
    templateOptions: {
      label: '@maxMultiplicity',
      type: 'number',
    },
  },
  {
    type: 'input',
    key: 'minMultiplicity',
    templateOptions: {
      label: '@minMultiplicity',
      type: 'number',
    },
  },
  WRITABLE_PROPERTY,
  getTargetProperty(items),
];

export function getTargetProperty(items: SelectOption[]): FormlyFieldConfig {
  return {
    type: 'select',
    key: 'target',
    templateOptions: {
      label: 'Target',
      required: true,
      options: [...items],
    },
  };
}
