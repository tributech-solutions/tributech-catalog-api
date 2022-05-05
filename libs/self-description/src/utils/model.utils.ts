import { Vertex } from 'jsonld-graph';
import { Complete, SelfDescription } from '../models/common';
import {
  ContextType,
  SelfDescriptionType,
  TwinContentType,
} from '../models/constants';
import {
  Command,
  Component,
  ExpandedInterface,
  Interface,
  Property,
  Relationship,
  Telemetry,
} from '../models/models';
import {
  getArraySchema,
  getEnumSchema,
  getMapSchema,
  getObjectSchema,
  inferSchema,
} from './schema.utils';
import {
  getCommandRequest,
  getCommandResponse,
  getComment,
  getComponentSchema,
  getDescription,
  getDisplayName,
  getName,
  getPropertyByName,
  getTypes,
  getUnit,
  getWritable,
} from './vertex.utils';

export const REL_TARGET_ANY = '*';

export function inferTarget(vertex: Vertex): string {
  if (!vertex) return REL_TARGET_ANY;

  const targetEdge = vertex.getOutgoing('dtmi:dtdl:property:target;2').first();
  return targetEdge ? targetEdge.to.id : REL_TARGET_ANY;
}

export function getBaseModelPropertiesFromVertex(
  vertex: Vertex
): SelfDescription {
  const base = {} as SelfDescription;

  if (!vertex) throw new Error('vertex is null!');

  if (getTypes(vertex).length > 0) {
    base['@type'] = getTypes(vertex);
  }

  if (vertex?.id && !vertex.id.includes('_:')) {
    base['@id'] = vertex?.id;
  }

  if (getDisplayName(vertex)) {
    base.displayName = getDisplayName(vertex);
  }
  if (getComment(vertex)) {
    base.comment = getComment(vertex);
  }
  if (getDescription(vertex)) {
    base.description = getDescription(vertex);
  }
  return base as Complete<SelfDescription>;
}

export function getPropertyFromVertex(vertex: Vertex): Property | undefined {
  if (!vertex || !vertex?.isType(TwinContentType.Property)) {
    return undefined;
  }

  const property: Property = {
    ...getBaseModelPropertiesFromVertex(vertex),
    name: getName(vertex),
    schema: inferSchema(vertex),
    writable: getWritable(vertex),
  } as Property;

  if (property && property?.['@type'] && property?.['@type']?.length > 1) {
    property.unit = getUnit(vertex);
  }

  return property;
}

export function getTelemetryFromVertex(vertex: Vertex): Telemetry | undefined {
  if (!vertex || !vertex?.isType(TwinContentType.Telemetry)) {
    return undefined;
  }

  const telemetry: Telemetry = {
    ...getBaseModelPropertiesFromVertex(vertex),
    name: getName(vertex),
    schema: inferSchema(vertex),
  } as Telemetry;

  if (telemetry && telemetry?.['@type'] && telemetry?.['@type']?.length > 1) {
    // set unit based on semantic type if not present?
    telemetry.unit = getUnit(vertex);
  }

  return telemetry;
}

export function getRelationshipFromVertex(
  vertex: Vertex
): Relationship | undefined {
  if (!vertex || !vertex?.isType(TwinContentType.Relationship)) {
    return undefined;
  }

  const properties: Property[] = vertex
    .getOutgoing('dtmi:dtdl:property:properties;2')
    .items()
    .reduce(
      (prev, v) =>
        getContentFromVertex(v.to, TwinContentType.Property) as Property[],
      [] as Property[]
    );

  return {
    ...getBaseModelPropertiesFromVertex(vertex),
    name: getName(vertex),
    target: inferTarget(vertex),
    maxMultiplicity: getPropertyByName<number>(vertex, 'maxMultiplicity', 1),
    minMultiplicity: getPropertyByName<number>(vertex, 'minMultiplicity', 0),
    writable: getWritable(vertex),
    properties,
  } as Relationship;
}

export function getCommandFromVertex(vertex: Vertex): Command | undefined {
  if (!vertex || !vertex?.isType(TwinContentType.Command)) {
    return undefined;
  }

  return {
    ...getBaseModelPropertiesFromVertex(vertex),
    name: getName(vertex),
    request: getCommandRequest(vertex),
    response: getCommandResponse(vertex),
  } as Command;
}

export function getComponentFromVertex(vertex: Vertex): Component | undefined {
  if (!vertex || !vertex?.isType(TwinContentType.Component)) {
    return undefined;
  }

  return {
    ...getBaseModelPropertiesFromVertex(vertex),
    name: getName(vertex),
    schema: getComponentSchema(vertex, ''),
  } as Component;
}

export function getInterfaceFromVertex(v: Vertex): Interface {
  return {
    '@context': ContextType.DTDL2,
    ...getBaseModelPropertiesFromVertex(v),
    contents: v
      .getOutgoing('dtmi:dtdl:property:contents;2')
      .items()
      .map((edge) => mapToTwinType(edge?.to)),
    schemas: v
      .getOutgoing('dtmi:dtdl:property:schemas;2')
      .items()
      .map((edge) => mapInterfaceSchema(edge?.to)),
  } as Interface;
}

export function expandInterface(v: Vertex): ExpandedInterface {
  if (!v) throw new Error('Empty Vertex!');
  return {
    '@context': ContextType.DTDL2,
    ...getBaseModelPropertiesFromVertex(v),
    '@type': SelfDescriptionType.Interface,
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
    commands: getContentFromVertex(v, TwinContentType.Command) as Command[],
    bases: getBasesFromVertex(v),
  };
}

export function getContentFromVertex(v: Vertex, type: TwinContentType) {
  let content: (
    | Property
    | Component
    | Relationship
    | Telemetry
    | Command
    | undefined
  )[] = [];

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

  if (vertex?.isType('dtmi:dtdl:class:Command;2')) {
    return getCommandFromVertex(vertex);
  }

  throw new Error('Unknown Twin Type!');
}

export function mapInterfaceSchema(vertex: Vertex) {
  if (vertex?.isType('dtmi:dtdl:class:Array;2')) {
    return getArraySchema(vertex);
  }

  if (vertex?.isType('dtmi:dtdl:class:Enum;2')) {
    return getEnumSchema(vertex);
  }

  if (vertex?.isType('dtmi:dtdl:class:Map;2')) {
    return getMapSchema(vertex);
  }

  if (vertex?.isType('dtmi:dtdl:class:Object;2')) {
    return getObjectSchema(vertex);
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
  Object.keys(item).every((x) => item[x] !== undefined) &&
    collection.push(item);
}
