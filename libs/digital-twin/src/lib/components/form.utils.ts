import { FormlyFieldConfig } from '@ngx-formly/core';
import { uuidv4 } from '@tributech/core';
import { filter } from 'lodash';
import {
  EnumSchema,
  ExpandedTwinModel,
  Field,
  MapSchema,
  ObjectSchema,
  Property,
} from '../models/data.model';

export function convertToFormConfig(
  properties: Property[],
  parent?: ExpandedTwinModel
): FormlyFieldConfig[] {
  if (!properties) return [];

  const config = [];

  for (const property of properties) {
    config.push(processPropertyEntry(property, parent));
  }

  return filter(config, (c) => !!c);
}

function processPropertyEntry(
  propertyData: Property,
  parent?: ExpandedTwinModel
) {
  switch (propertyData?.schema) {
    case 'dtmi:dtdl:instance:Schema:duration;2':
    case 'dtmi:dtdl:instance:Schema:string;2':
    case 'dtmi:dtdl:instance:Schema:dateTime;2':
    case 'dateTime':
    case 'string':
    case 'duration':
      return createStringInput(propertyData, parent);
    case 'dtmi:dtdl:instance:Schema:boolean;2':
    case 'boolean':
      return createBooleanInput(propertyData, parent);
    case 'dtmi:dtdl:instance:Schema:double;2':
    case 'dtmi:dtdl:instance:Schema:integer;2':
    case 'dtmi:dtdl:instance:Schema:long;2':
    case 'dtmi:dtdl:instance:Schema:float;2':
    case 'double':
    case 'integer':
    case 'long':
    case 'float':
      return createNumberInput(propertyData, parent);
    default:
      return processComplexPropertyEntry(propertyData, parent);
  }
}

function processFieldEntry(fieldData: Field, parent?: ExpandedTwinModel) {
  switch (fieldData?.schema) {
    case 'dtmi:dtdl:instance:Schema:boolean;2':
    case 'boolean':
      return createBooleanInput(fieldData, parent);
    case 'dtmi:dtdl:instance:Schema:duration;2':
    case 'dtmi:dtdl:instance:Schema:double;2':
    case 'dtmi:dtdl:instance:Schema:integer;2':
    case 'dtmi:dtdl:instance:Schema:long;2':
    case 'dtmi:dtdl:instance:Schema:float;2':
    case 'double':
    case 'integer':
    case 'long':
    case 'float':
      return createNumberInput(fieldData, parent);
    case 'dtmi:dtdl:instance:Schema:string;2':
    case 'dtmi:dtdl:instance:Schema:dateTime;2':
    case 'dateTime':
    case 'string':
    default:
      return createStringInput(fieldData, parent);
  }
}

function processComplexPropertyEntry(
  propertyData: Property,
  parent?: ExpandedTwinModel
) {
  switch (propertyData?.schema?.['@type']) {
    case 'Object':
      return createObjectFormField(propertyData);
    case 'Enum':
      return createEnumFormField(propertyData);
    case 'Map':
      return createMapFormField(propertyData);
    default: {
      console.warn('Unknown propertyType', propertyData);
      return undefined;
    }
  }
}

function getDefaultForSpecialFields(
  propertyData: Property | Field,
  parent?: ExpandedTwinModel
) {
  switch (propertyData?.name) {
    case 'ValueMetadataId':
      return uuidv4();
    case 'Name':
      return parent?.displayName;
    default:
      return undefined;
  }
}

function createStringInput(
  propertyData: Property | Field,
  parent?: ExpandedTwinModel
): FormlyFieldConfig {
  return {
    type: 'input',
    key: propertyData?.name,
    defaultValue: getDefaultForSpecialFields(propertyData, parent),
    templateOptions: {
      label: propertyData?.displayName || propertyData?.name,
      required: false,
      readonly: isReadOnly(propertyData),
      description: propertyData?.description,
    },
    expressionProperties: {
      'templateOptions.disabled': 'formState.disabled',
    },
  };
}

function createBooleanInput(
  propertyData: Property | Field,
  parent?: ExpandedTwinModel
): FormlyFieldConfig {
  return {
    type: 'checkbox',
    key: propertyData?.name,
    templateOptions: {
      label: propertyData?.displayName || propertyData?.name,
      required: false,
      readonly: isReadOnly(propertyData),
      description: propertyData?.description,
    },
    expressionProperties: {
      'templateOptions.disabled': 'formState.disabled',
    },
  };
}

function createNumberInput(
  propertyData: Property | Field,
  parent?: ExpandedTwinModel
): FormlyFieldConfig {
  return {
    type: 'input',
    key: propertyData?.name,
    templateOptions: {
      type: 'number',
      label: propertyData?.displayName || propertyData?.name,
      required: false,
      readonly: isReadOnly(propertyData),
      description: propertyData?.description,
    },
    expressionProperties: {
      'templateOptions.disabled': 'formState.disabled',
    },
  };
}

function createEnumFormField(
  propertyData: Property,
  parent?: ExpandedTwinModel
): FormlyFieldConfig {
  const enumSchema: EnumSchema = propertyData?.schema as EnumSchema;
  const enumValues = enumSchema?.enumValues;

  return {
    type: 'select',
    key: propertyData?.name,
    templateOptions: {
      label: propertyData?.displayName || propertyData?.name,
      required: false,
      readonly: isReadOnly(propertyData),
      description: propertyData?.description,
      options: enumValues?.map((val) => ({
        label: val?.displayName || val?.name,
        value: val?.enumValue,
      })),
    },
    expressionProperties: {
      'templateOptions.disabled': 'formState.disabled',
    },
  };
}

function createObjectFormField(
  propertyData: Property,
  parent?: ExpandedTwinModel
): FormlyFieldConfig {
  const objectSchema = propertyData?.schema as ObjectSchema;

  return {
    key: propertyData?.name,
    wrappers: ['panel'],
    templateOptions: {
      label: propertyData?.displayName || propertyData?.name,
      description: propertyData?.description,
      readonly: isReadOnly(propertyData),
      required: false,
    },
    fieldGroup: [
      ...objectSchema.fields.map((field) => processFieldEntry(field)),
    ],
    expressionProperties: {
      'templateOptions.disabled': 'formState.disabled',
    },
  };
}

function createMapFormField(
  propertyData: Property,
  parent?: ExpandedTwinModel
): FormlyFieldConfig {
  const mapSchema = propertyData?.schema as MapSchema;

  return {
    key: propertyData?.name,
    templateOptions: {
      addText: 'Add another value pair',
      label: propertyData?.displayName || propertyData?.name,
      readonly: isReadOnly(propertyData),
      description: propertyData?.description,
      required: false,
    },
    fieldArray: {
      fieldGroup: [
        {
          key: mapSchema?.mapKey?.name,
          type: 'input',
          templateOptions: {
            label: propertyData?.displayName || propertyData?.name,
          },
        },
        {
          key: mapSchema?.mapValue?.name,
          type: 'input',
          templateOptions: {
            label: propertyData?.displayName || propertyData?.name,
          },
        },
      ],
    },
    expressionProperties: {
      'templateOptions.disabled': 'formState.disabled',
    },
  };
}

function isReadOnly(propertyData: Property | Field): boolean {
  return isProperty(propertyData) ? !propertyData?.writable : false;
}

function isProperty(propertyData: Property | Field): propertyData is Property {
  return 'writable' in propertyData;
}
