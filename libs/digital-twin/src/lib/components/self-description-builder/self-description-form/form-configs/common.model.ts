import { FormControl, ValidationErrors } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

export interface SelectOption {
  value: string;
  label: string;
}

export function PropertyNameRegex(control: FormControl): ValidationErrors {
  return /^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$/.test(control.value)
    ? null
    : { regexName: true };
}

export function DTMIRegex(control: FormControl): ValidationErrors {
  return /^dtmi:[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?(?::[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?)*;[1-9][0-9]{0,8}$/.test(
    control.value
  )
    ? null
    : { regexName: true };
}

export const DEFAULT_FIELDS: FormlyFieldConfig[] = [
  {
    type: 'input',
    key: '@id',
    templateOptions: {
      label: '@id',
      required: true,
      readonly: false,
      maxLength: 128,
    },
    validators: {
      validation: [DTMIRegex],
    },
  },
  {
    type: 'input',
    key: '@type',
    templateOptions: {
      label: '@type',
      required: true,
      readonly: true,
    },
  },
  {
    type: 'textarea',
    key: 'comment',
    templateOptions: {
      label: 'Comment',
      required: false,
      maxLength: 512,
      grow: true,
      rows: 3,
    },
  },
  {
    type: 'textarea',
    key: 'description',
    templateOptions: {
      label: 'Description',
      required: false,
      maxLength: 512,
      grow: true,
      rows: 3,
    },
  },
  {
    type: 'input',
    key: 'displayName',
    templateOptions: {
      label: 'Display Name',
      required: false,
      maxLength: 64,
    },
  },
];

export const NAME_PROPERTY: FormlyFieldConfig = {
  type: 'input',
  key: 'name',
  templateOptions: {
    label: 'Name',
    required: true,
    maxLength: 64,
  },
  validators: {
    validation: [PropertyNameRegex],
  },
};

export const WRITABLE_PROPERTY: FormlyFieldConfig = {
  type: 'checkbox',
  key: 'writable',
  templateOptions: {
    label: 'Writable',
    required: false,
  },
};

export function getSchemaProperty(
  items: SelectOption[],
  key: string = 'schema'
): FormlyFieldConfig {
  return {
    ...SCHEMA_PROPERTY,
    key,
    templateOptions: {
      ...SCHEMA_PROPERTY.templateOptions,
      options: [
        ...(SCHEMA_PROPERTY.templateOptions.options as any[]),
        ...items,
      ],
    },
  };
}

export const SCHEMA_PROPERTY: FormlyFieldConfig = {
  type: 'select',
  key: 'schema',
  templateOptions: {
    label: 'Schema',
    required: true,
    options: [
      { value: 'boolean', label: 'boolean' },
      { value: 'date', label: 'date' },
      { value: 'dateTime', label: 'dateTime' },
      { value: 'double', label: 'double' },
      { value: 'duration', label: 'duration' },
      { value: 'float', label: 'float' },
      { value: 'integer', label: 'integer' },
      { value: 'long', label: 'long' },
      { value: 'string', label: 'string' },
      { value: 'time', label: 'time' },
      { value: 'point', label: 'point' },
      { value: 'multiPoint', label: 'multiPoint' },
      { value: 'lineString', label: 'lineString' },
      { value: 'multiLineString', label: 'multiLineString' },
      { value: 'polygon', label: 'polygon' },
      { value: 'multiPolygon', label: 'multiPolygon' },
    ],
  },
};
