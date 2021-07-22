import { Vertex } from 'jsonld-graph';
import {
  ArraySchema,
  EnumSchema,
  Interface,
  MapSchema,
  ObjectSchema,
  PrimitiveSchema,
  Schema,
} from '../models/models';
import {
  getBaseModelPropertiesFromVertex,
  getInterfaceFromVertex,
} from './model.utils';

export function getObjectSchema(vertex: Vertex): ObjectSchema {
  return {
    ...getBaseModelPropertiesFromVertex(vertex),
    fields: [
      ...vertex
        .getOutgoing('dtmi:dtdl:property:fields;2')
        .map((edge) => ({
          ...getBaseModelPropertiesFromVertex(edge.to),
          schema: inferSchema(edge.to) as Schema,
        }))
        .filter((edge) => !!edge.schema),
    ],
  };
}

export function getEnumSchema(vertex: Vertex): EnumSchema {
  return {
    ...getBaseModelPropertiesFromVertex(vertex),
    enumValues: [
      ...vertex.getOutgoing('dtmi:dtdl:property:enumValues;2').map((edge) => ({
        ...getBaseModelPropertiesFromVertex(edge.to),
        enumValue: edge.to.getAttributeValue('dtmi:dtdl:property:enumValue;2'),
      })),
    ],
    valueSchema: vertex
      .getOutgoing('dtmi:dtdl:property:valueSchema;2')
      .map((edge) => simplifySchemaString(edge.to.id))
      .first(),
  };
}

export function getMapSchema(vertex: Vertex): MapSchema {
  return {
    ...getBaseModelPropertiesFromVertex(vertex),
    mapKey: vertex
      .getOutgoing('dtmi:dtdl:property:mapKey;2')
      .map((edge) => ({
        ...getBaseModelPropertiesFromVertex(edge.to),
        schema: inferSchema(edge.to) as string,
      }))
      .first(),
    mapValue: vertex
      .getOutgoing('dtmi:dtdl:property:mapValue;2')
      .map((edge) => ({
        ...getBaseModelPropertiesFromVertex(edge.to),
        schema: inferSchema(edge.to) as Schema,
      }))
      .first(),
  };
}

export function getArraySchema(vertex: Vertex): ArraySchema {
  return {
    ...getBaseModelPropertiesFromVertex(vertex),
    elementSchema: vertex
      .getOutgoing('dtmi:dtdl:property:elementSchema;2')
      .map((edge) => inferSchema(edge.to))
      .first(),
  };
}

export function inferSchema(
  vertex: Vertex,
  simplifyTypename = true
): Schema | undefined {
  const schemaEdge = vertex.getOutgoing('dtmi:dtdl:property:schema;2').first();
  if (!schemaEdge) return undefined;

  if (schemaEdge.to.isType('dtmi:dtdl:class:Object;2')) {
    return getObjectSchema(schemaEdge?.to);
  }

  if (schemaEdge.to.isType('dtmi:dtdl:class:Enum;2')) {
    return getEnumSchema(schemaEdge?.to);
  }

  if (schemaEdge.to.isType('dtmi:dtdl:class:Map;2')) {
    return getMapSchema(schemaEdge?.to);
  }

  if (schemaEdge.to.isType('dtmi:dtdl:class:Array;2')) {
    return getArraySchema(schemaEdge?.to);
  }

  if (!simplifyTypename) {
    return schemaEdge.to.id as PrimitiveSchema;
  }

  return simplifySchemaString(schemaEdge.to.id);
}

export function simplifySchemaString(schemaStr: string): PrimitiveSchema {
  const dtdlRegex = /dtmi:dtdl:instance:Schema:([A-Za-z]*);[1-9][0-9]{0,8}/g;
  const match = dtdlRegex.exec(schemaStr);
  return match ? (match[1] as PrimitiveSchema) : (schemaStr as PrimitiveSchema);
}

export function inferComponentSchema(
  vertex: Vertex
): Interface | string | undefined {
  const schemaEdge = vertex.getOutgoing('dtmi:dtdl:property:schema;2').first();

  if (!schemaEdge) return undefined;

  if (schemaEdge.to.isType('dtmi:dtdl:class:Interface;2')) {
    return getInterfaceFromVertex(schemaEdge?.to);
  }

  return schemaEdge.to.id;
}
