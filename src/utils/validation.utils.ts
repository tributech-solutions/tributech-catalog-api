import { filter, forEach } from 'lodash';
import { JSONSchemaType, PartialSchema } from '../models/json-schema.model';
import {
  ArraySchema,
  BasicRelationship,
  EnumSchema,
  EnumValue,
  ExpandedInterface,
  Field,
  Interface,
  InterfaceContent,
  ObjectSchema,
  Property,
  Schema,
} from '../models/models';
import { isProperty } from './dtml.utils';

/**
 * Basic generation for relationship validation
 * For now we only check if targetId and sourceId are possible.
 */
export function getRelationshipJSONSchema(
  validTwinIds: string[]
): PartialSchema<BasicRelationship> {
  const properties: JSONSchemaType<Interface>['properties'] = {};

  properties['$relationshipId'] = {
    type: 'string',
  };

  properties['$targetId'] = {
    type: 'string',
    enum: validTwinIds,
  };

  properties['$sourceId'] = {
    type: 'string',
    enum: validTwinIds,
  };

  properties['$relationshipName'] = {
    type: 'string',
  };

  properties['$etag'] = {
    type: 'string',
  };

  const schema: PartialSchema<Interface> = {
    type: 'object',
    properties,
    required: [
      '$relationshipId',
      '$targetId',
      '$sourceId',
      '$relationshipName',
      '$etag',
    ],
    additionalProperties: true,
  };

  return schema;
}

export function generateJSONSchema(
  model: ExpandedInterface
): PartialSchema<Interface> {
  const properties: JSONSchemaType<Interface>['properties'] = {};

  properties['$dtId'] = {
    type: 'string',
    // pattern:
    //   '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
  };

  properties['$etag'] = {
    type: 'string',
    // pattern:
    //   '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
  };

  properties['$metadata'] = {
    type: 'object',
    properties: {
      $model: {
        type: 'string',
        pattern: '^dtmi:[a-z:]*;[1-99]',
      },
    },
    required: ['$model'],
  };

  forEach(model?.properties, (property: Property) => {
    properties[property?.name] = {
      ...processSchema(property?.schema),
    };
  });

  const schema: PartialSchema<Interface> = {
    // $schema: 'https://json-schema.org/draft/2019-09/schema',
    // $id: 'https://tributech.io/schemas/string',
    type: 'object',
    properties,
    required: ['$dtId', '$etag', '$metadata'],
    additionalProperties: false,
  };

  return schema;
}

export function getProperties(
  contents: InterfaceContent[] | undefined
): Property[] {
  return filter(contents, (content: InterfaceContent) =>
    isProperty(content)
  ) as any[] as Property[];
}

function processSchema(schema: Schema) {
  switch (schema) {
    case 'dtmi:dtdl:instance:Schema:duration;2':
    case 'dtmi:dtdl:instance:Schema:string;2':
    case 'string':
      return { type: 'string' };
    case 'dtmi:dtdl:instance:Schema:boolean;2':
    case 'boolean':
      return { type: 'boolean' };

    case 'dtmi:dtdl:instance:Schema:integer;2':
    case 'integer':
      return { type: 'integer' };
    case 'dtmi:dtdl:instance:Schema:long;2':
    case 'dtmi:dtdl:instance:Schema:float;2':
    case 'dtmi:dtdl:instance:Schema:double;2':
    case 'double':
    case 'long':
    case 'float':
      return { type: 'number' };
    default:
      return processComplexPropertyEntry(schema);
  }
}

function processComplexPropertyEntry(schema: Schema) {
  switch (schema?.['@type']) {
    case 'Array': {
      const data = schema as ArraySchema;
      return {
        type: 'array',
        contains: processSchema(data?.elementSchema),
      };
    }
    case 'Object': {
      const data = schema as ObjectSchema;
      const properties: JSONSchemaType<Interface>['properties'] = {};

      forEach(data?.fields, (field: Field) => {
        properties[field?.name] = {
          ...processSchema(field?.schema),
        };
      });

      return {
        type: 'object',
        properties,
      };
    }
    case 'Enum': {
      const data = schema as EnumSchema;
      const type = data?.valueSchema === 'integer' ? 'number' : 'string';
      const enumValues = data?.enumValues?.map((e: EnumValue) => e?.enumValue);
      return { type, enum: enumValues };
    }
    case 'Map': {
      return { type: 'object' };
    }
    default: {
      console.warn('Unknown propertyType', schema);
      return undefined;
    }
  }
}
