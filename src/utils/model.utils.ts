import { Vertex } from 'jsonld-graph';
import { TwinContentType } from '../models/constants';
import {
  Component,
  EnumSchema,
  ExpandedInterface,
  Interface,
  MapSchema,
  ObjectSchema,
  PrimitiveSchema,
  Property,
  Relationship,
  Schema,
  Telemetry,
} from '../models/models';

export const REL_TARGET_ANY = '*';

export function getModelDisplayName(vertex: Vertex): string {
  if (!vertex) return undefined;
  return vertex.getAttributeValue('dtmi:dtdl:property:displayName;2');
}

export function getModelDescription(vertex: Vertex): string {
  if (!vertex) return undefined;

  return vertex.getAttributeValue('dtmi:dtdl:property:description;2');
}

export function getModelComment(vertex: Vertex): string {
  if (!vertex) return undefined;

  return vertex.getAttributeValue('dtmi:dtdl:property:comment;2');
}

export function getPropertyName(vertex: Vertex): string {
  if (!vertex) return undefined;

  return vertex.getAttributeValue('dtmi:dtdl:property:name;2');
}

export function getPropertyWritable(vertex: Vertex): boolean {
  if (!vertex) return undefined;

  return vertex.getAttributeValue('dtmi:dtdl:property:writable;2');
}

export function inferTarget(vertex: Vertex): string {
  if (!vertex) return REL_TARGET_ANY;

  const targetEdge = vertex.getOutgoing('dtmi:dtdl:property:target;2').first();
  return targetEdge ? targetEdge.to.id : REL_TARGET_ANY;
}

export function getObjectSchema(vertex: Vertex): ObjectSchema {
  return {
    '@type': 'Object',
    '@id': vertex?.id,
    comment: getModelComment(vertex),
    description: getModelDescription(vertex),
    displayName: getModelDisplayName(vertex),
    fields: [
      ...vertex
        .getOutgoing('dtmi:dtdl:property:fields;2')
        .map((edge) => ({
          name: getPropertyName(edge.to),
          schema: inferSchema(edge.to),
        }))
        .filter((edge) => !!edge.schema),
    ],
  };
}

export function getEnumSchema(vertex: Vertex): EnumSchema {
  return {
    '@type': 'Enum',
    '@id': vertex?.id,
    comment: getModelComment(vertex),
    description: getModelDescription(vertex),
    displayName: getModelDisplayName(vertex),
    enumValues: [
      ...vertex.getOutgoing('dtmi:dtdl:property:enumValues;2').map((edge) => ({
        name: getPropertyName(edge.to),
        enumValue: edge.to.getAttributeValue('dtmi:dtdl:property:enumValue;2'),
      })),
    ],
    valueSchema: vertex
      .getOutgoing('dtmi:dtdl:property:valueSchema;2')
      .map((edge) => edge.to.iri)
      .first(),
  };
}

export function getMapSchema(vertex: Vertex): MapSchema {
  return {
    '@type': 'Map',
    '@id': vertex?.id,
    comment: getModelComment(vertex),
    description: getModelDescription(vertex),
    displayName: getModelDisplayName(vertex),
    mapKey: vertex
      .getOutgoing('dtmi:dtdl:property:mapKey;2')
      .map((edge) => ({
        name: getPropertyName(edge.to),
        schema: edge.to.id as string,
      }))
      .first(),
    mapValue: vertex
      .getOutgoing('dtmi:dtdl:property:mapValue;2')
      .map((edge) => ({
        name: getPropertyName(edge.to),
        schema: inferSchema(edge.to),
      }))
      .first(),
  };
}

export function inferSchema(vertex: Vertex): Schema {
  const schemaEdge = vertex.getOutgoing('dtmi:dtdl:property:schema;2').first();
  if (!schemaEdge) return null;

  if (schemaEdge.to.isType('dtmi:dtdl:class:Object;2')) {
    return getObjectSchema(schemaEdge?.to);
  }

  if (schemaEdge.to.isType('dtmi:dtdl:class:Enum;2')) {
    return getEnumSchema(schemaEdge?.to);
  }

  if (schemaEdge.to.isType('dtmi:dtdl:class:Map;2')) {
    return getMapSchema(schemaEdge?.to);
  }
  return schemaEdge.to.id as PrimitiveSchema;
}

export function inferComponentSchema(vertex: Vertex): Interface | string {
  const schemaEdge = vertex.getOutgoing('dtmi:dtdl:property:schema;2').first();

  if (!schemaEdge) return null;

  if (schemaEdge.to.isType('dtmi:dtdl:class:Interface;2')) {
    return getInterfaceFromVertex(schemaEdge?.to);
  }

  return schemaEdge.to.id;
}

export function getPropertyFromVertex(vertex: Vertex): Property {
  if (!vertex || !vertex?.isType(TwinContentType.Property)) {
    return null;
  }

  return {
    '@type': 'Property',
    name: getPropertyName(vertex),
    displayName: getModelDisplayName(vertex),
    schema: inferSchema(vertex),
    writable: getPropertyWritable(vertex),
    comment: getModelComment(vertex),
    description: getModelDescription(vertex),
  };
}

export function getTelemetryFromVertex(vertex: Vertex): Telemetry {
  if (!vertex || !vertex?.isType(TwinContentType.Telemetry)) {
    return null;
  }

  return {
    '@type': 'Telemetry',
    name: getPropertyName(vertex),
    displayName: getModelDisplayName(vertex),
    schema: inferSchema(vertex),
    comment: getModelComment(vertex),
    description: getModelDescription(vertex),
  };
}

export function getRelationshipFromVertex(vertex: Vertex): Relationship {
  if (!vertex || !vertex?.isType(TwinContentType.Relationship)) {
    return null;
  }

  const outgoing = vertex.getOutgoing('dtmi:dtdl:property:properties;2');
  const properties = outgoing
    .items()
    .reduce(
      (prev, v) => getContentFromVertex(v.to, TwinContentType.Property),
      [] as Property[]
    ) as Property[];

  return {
    '@type': 'Relationship',
    name: getPropertyName(vertex),
    displayName: getModelDisplayName(vertex),
    target: inferTarget(vertex),
    comment: getModelComment(vertex),
    description: getModelDescription(vertex),
    properties,
  };
}

export function getComponentFromVertex(vertex: Vertex): Component {
  if (!vertex || !vertex?.isType(TwinContentType.Component)) {
    return null;
  }

  return {
    '@type': 'Component',
    name: getPropertyName(vertex),
    displayName: getModelDisplayName(vertex),
    comment: getModelComment(vertex),
    description: getModelDescription(vertex),
    schema: getInterfaceFromVertex(vertex),
  };
}

export function getInterfaceFromVertex(v: Vertex): Interface {
  return {
    '@type': 'Interface',
    '@id': v.id,
    '@context': 'dtmi:dtdl:context;2',
    displayName: getModelDisplayName(v),
    comment: getModelComment(v),
    description: getModelDescription(v),
    contents: v
      .getOutgoing('dtmi:dtdl:property:contents;2')
      .items()
      .map((edge) => mapToTwinType(edge?.to)),
  };
}

export function expandInterface(v: Vertex): ExpandedInterface {
  if (!v) return null;
  return {
    '@id': v.id,
    '@type': 'Interface',
    '@context': 'dtmi:dtdl:context;2',
    displayName: getModelDisplayName(v),
    description: getModelDescription(v),
    comment: getModelComment(v),
    properties: getContentFromVertex(v, TwinContentType.Property) as Property[],
    relationships: getContentFromVertex(
      v,
      TwinContentType.Relationship
    ) as Relationship[],
    telemetries: getContentFromVertex(
      v,
      TwinContentType.Telemetry
    ) as Telemetry[],
    components: getContentFromVertex(
      v,
      TwinContentType.Component
    ) as Component[],
    bases: getBasesFromVertex(v),
  };
}

export function getContentFromVertex(v: Vertex, type: TwinContentType) {
  let content: (Property | Component | Relationship | Telemetry)[] = [];

  v.getOutgoing('dtmi:dtdl:property:extends;2')
    .items()
    .forEach((x) => {
      content = [...content, ...getContentFromVertex(x.to, type)];
    });

  const edges = v
    .getOutgoing('dtmi:dtdl:property:contents;2')
    .items()
    .filter((e) => e?.to?.isType(type));

  content = [...content, ...edges?.map((edge) => mapToTwinType(edge?.to))];

  return content;
}

export function getBasesFromVertex(vertex: Vertex): string[] {
  const bases: string[] = [];
  if (!vertex) return [];

  vertex
    .getOutgoing('dtmi:dtdl:property:extends;2')
    .items()
    .forEach((x) => {
      bases.push(x.to.id);
      bases.push(...getBasesFromVertex(x.to));
    });

  return bases;
}

export function mapToTwinType(vertex: Vertex) {
  if (vertex?.isType('dtmi:dtdl:class:Property;2')) {
    return getPropertyFromVertex(vertex);
  }

  if (vertex?.isType('dtmi:dtdl:class:Telemetry;2')) {
    return getTelemetryFromVertex(vertex);
  }

  if (vertex?.isType('dtmi:dtdl:class:Relationship;2')) {
    return getRelationshipFromVertex(vertex);
  }

  if (vertex?.isType('dtmi:dtdl:class:Component;2')) {
    return getComponentFromVertex(vertex);
  }

  throw new Error('Unknown Twin Type!');
}

export function isBaseModel(v: Vertex) {
  return v.hasIncoming('dtmi:dtdl:property:extends;2');
}

export function hasRelationships(v: Vertex) {
  return (
    !v.hasOutgoing('dtmi:dtdl:property:contents;2') ||
    v
      .getOutgoing('dtmi:dtdl:property:contents;2')
      .some((x) => x.to.isType('dtmi:dtdl:class:Relationship;2'))
  );
}

export function isDirectTargetOfEdge(v: Vertex) {
  return v.hasIncoming('dtmi:dtdl:property:target;2');
}

export function getChildrenVertices(v: Vertex) {
  return v
    .getIncoming('dtmi:dtdl:property:extends;2')
    .map((edge) => edge?.from)
    .items();
}

export function getParentVertices(v: Vertex) {
  return v
    .getOutgoing('dtmi:dtdl:property:extends;2')
    .map((edge) => edge?.to)
    .items();
}

export function hasNoIncomingRelationships(v: Vertex) {
  return (
    !hasRelationships(v) &&
    !isDirectTargetOfEdge(v) &&
    v
      .getOutgoing('dtmi:dtdl:property:extends;2')
      .every((edge) => !isDirectTargetOfEdge(edge?.to))
  );
}

export function safeAdd<T>(collection: T[], item: T) {
  Object.keys(item).every((x) => item[x] !== null) && collection.push(item);
}
