import { FormlyFieldConfig } from '@ngx-formly/core';

export const DEFAULT_FIELDS_TWIN: FormlyFieldConfig[] = [
  {
    type: 'input',
    key: '$dtId',
    templateOptions: {
      label: 'dtId',
      required: true,
      readonly: true,
    },
  },
  {
    type: 'input',
    key: '$etag',
    templateOptions: {
      label: 'etag',
      required: true,
      readonly: true,
    },
  },
  {
    key: '$metadata',
    templateOptions: {
      label: 'Metadata',
    },
    fieldGroup: [
      {
        key: '$model',
        type: 'input',
        templateOptions: {
          required: true,
          type: 'text',
          label: 'Model',
          readonly: true,
        },
      },
    ],
  },
];

export const DEFAULT_FIELDS_TWIN_HIDDEN: FormlyFieldConfig[] = [
  {
    type: 'input',
    key: '$dtId',
    templateOptions: {
      label: 'dtId',
      required: true,
      readonly: true,
    },
    hide: true,
  },
  {
    type: 'input',
    key: '$etag',
    templateOptions: {
      label: 'etag',
      required: true,
      readonly: true,
    },
    hide: true,
  },
  {
    key: '$metadata',
    templateOptions: {
      label: 'Metadata',
    },
    hide: true,
    fieldGroup: [
      {
        key: '$model',
        type: 'input',
        templateOptions: {
          required: true,
          type: 'text',
          label: 'Model',
          readonly: true,
        },
      },
    ],
  },
];

export const DEFAULT_FIELDS_RELATION: FormlyFieldConfig[] = [
  {
    type: 'input',
    key: '$relationshipName',
    templateOptions: {
      label: '$relationshipName',
      required: true,
      readonly: true,
    },
  },
  {
    type: 'input',
    key: '$etag',
    templateOptions: {
      label: 'etag',
      required: true,
      readonly: true,
    },
  },
  {
    type: 'input',
    key: '$relationshipId',
    templateOptions: {
      label: '$relationshipId',
      required: true,
      readonly: true,
    },
  },
  {
    type: 'input',
    key: '$sourceId',
    templateOptions: {
      label: '$sourceId',
      required: true,
      readonly: true,
    },
  },
  {
    type: 'input',
    key: '$targetId',
    templateOptions: {
      label: '$targetId',
      required: true,
      readonly: true,
    },
  },
];
