import { Vertex } from 'jsonld-graph';
import { TwinContentType } from '../models/constants';
import {
  BaseModelWithId,
  Command,
  Component,
  ContextType,
  ExpandedInterface,
  Interface,
  Property,
  Relationship,
  Telemetry,
} from '../models/models';
import { inferSchema } from './schema.utils';
import {
  getComment,
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
): BaseModelWithId {
  const base = {} as any;

  if (!vertex) throw new Error('vertex is null!');

  if (getTypes(vertex).length > 0) {
    base['@type'] = getTypes(vertex);
  }

  // ignore anonymous node ids
  if (vertex?.id && !vertex.id.includes('_:')) {
    base['@id'] = vertex?.id;
  }

  if (getDisplayName(vertex)) {
    base.displayName = getDisplayName(vertex);
  }
  if (getComment(vertex)) {
    base.comment = getComment(vertex);
  }
  if (getName(vertex)) {
    base.name = getName(vertex);
  }
  if (getDescription(vertex)) {
    base.description = getDescription(vertex);
  }
  return base;
}

export function getPropertyFromVertex(vertex: Vertex): Property | undefined {
  if (!vertex || !vertex?.isType(TwinContentType.Property)) {
    return undefined;
  }

  const property: Property = {
    ...getBaseModelPropertiesFromVertex(vertex),
    schema: inferSchema(vertex),
    writable: getWritable(vertex),
  };

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
    schema: inferSchema(vertex),
  };

  if (telemetry && telemetry?.['@type'] && telemetry?.['@type']?.length > 1) {
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
    target: inferTarget(vertex),
    maxMultiplicity: getPropertyByName<number>(vertex, 'maxMultiplicity', 1),
    minMultiplicity: getPropertyByName<number>(vertex, 'minMultiplicity', 0),
    writable: getWritable(vertex),
    properties,
  };
}

export function getCommandFromVertex(vertex: Vertex): Command | undefined {
  if (!vertex || !vertex?.isType(TwinContentType.Command)) {
    return undefined;
  }

  return {
    ...getBaseModelPropertiesFromVertex(vertex),
  };
}

export function getComponentFromVertex(vertex: Vertex): Component | undefined {
  if (!vertex || !vertex?.isType(TwinContentType.Component)) {
    return undefined;
  }

  return {
    ...getBaseModelPropertiesFromVertex(vertex),
    schema: getInterfaceFromVertex(vertex),
  };
}

export function getInterfaceFromVertex(v: Vertex): Interface {
  return {
    ...getBaseModelPropertiesFromVertex(v),
    '@context': ContextType.DTDL2,
    contents: v
      .getOutgoing('dtmi:dtdl:property:contents;2')
      .items()
      .map((edge) => mapToTwinType(edge?.to)),
  };
}

export function expandInterface(v: Vertex): ExpandedInterface {
  if (!v) throw new Error('Empty Vertex!');
  return {
    ...getBaseModelPropertiesFromVertex(v),
    '@context': ContextType.DTDL2,
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
  let content: (Property | Component | Relationship | Telemetry | undefined)[] =
    [];

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
