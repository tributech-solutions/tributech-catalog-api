import { FormlyFieldConfig } from '@ngx-formly/core';
import { DEFAULT_FIELDS, SelectOption } from './common.model';

export const DEFAULT_FIELDS_INTERFACE: (
  items: SelectOption[]
) => FormlyFieldConfig[] = (items: SelectOption[]) => [
  {
    type: 'input',
    key: '@context',
    defaultValue: 'dtmi:dtdl:context;2',
    templateOptions: {
      label: '@context',
      required: true,
      readonly: true,
    },
  },
  ...DEFAULT_FIELDS,
  getExtendsProperty(items),
];

export function getExtendsProperty(items: SelectOption[]): FormlyFieldConfig {
  return {
    type: 'select',
    key: 'extends',
    templateOptions: {
      label: 'Extends',
      required: false,
      multiple: true,
      options: [...items],
    },
  };
}
