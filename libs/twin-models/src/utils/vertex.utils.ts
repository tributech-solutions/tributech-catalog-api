import { Vertex } from 'jsonld-graph';
import { SelfDescriptionType } from '../models/constants';
import { CommandPayload } from '../models/models';
import { SemanticType } from '../models/semantic-type';
import { getBaseModelPropertiesFromVertex } from './model.utils';
import { inferSchema } from './schema.utils';

export function getDisplayName(vertex: Vertex): string {
  return getPropertyByName(vertex, 'displayName', '');
}

export function getDescription(vertex: Vertex): string {
  return getPropertyByName(vertex, 'description', '');
}

export function getComment(vertex: Vertex): string {
  return getPropertyByName(vertex, 'comment', '');
}

export function getName(vertex: Vertex): string {
  return getPropertyByName(vertex, 'name', '');
}

export function getWritable(vertex: Vertex): boolean {
  return getPropertyByName(vertex, 'writable', true);
}

export function getUnit(vertex: Vertex): string {
  return getPropertyByName(vertex, 'unit', '');
}

export function getTypes(
  vertex: Vertex,
  simplifyTypename = true
):
  | SelfDescriptionType
  | [SemanticType, SelfDescriptionType]
  | [SelfDescriptionType, SemanticType] {
  const dtdlRegex = /dtmi:dtdl:class:([A-Za-z]*);[1-9][0-9]{0,8}/g;
  if (!vertex) return [] as any;
  const types = vertex
    .getTypes()
    .map((_v) => _v.id)
    .items()
    .map((typeName: string) => {
      if (!simplifyTypename) return typeName;
      const match = dtdlRegex.exec(typeName);
      return match ? match[1] : typeName;
    });
  return types.length === 1 ? types[0] : (types as any);
}

// export function getType(vertex: Vertex): SelfDescriptionType {
//   if (!vertex) return SelfDescriptionType.Primitive;
//   return vertex
//     .getTypes()
//     .map((_v) => _v.id)
//     .first((i) => i.includes('Class')) as SelfDescriptionType;
// }

export function getPropertyByName<T>(
  vertex: Vertex,
  propertyName: string,
  defaultValue: T
): T {
  if (!vertex) return defaultValue;
  return vertex.getAttributeValue<T>(`dtmi:dtdl:property:${propertyName};2`);
}

export function getComponentSchema(
  vertex: Vertex,
  defaultValue: string
): string {
  if (!vertex) return defaultValue;
  const data = vertex
    .getOutgoing('dtmi:dtdl:property:schema;2')
    .items()
    .map((edge) => edge?.to)
    .pop() as Vertex;
  return data?.id ?? '';
}

export function getCommandRequest(vertex: Vertex): CommandPayload {
  const data = vertex
    .getOutgoing('dtmi:dtdl:property:request;2')
    .items()
    .map((edge) => edge?.to)
    .pop() as Vertex;

  const payload = {
    ...getBaseModelPropertiesFromVertex(data),
    name: getName(vertex),
    schema: inferSchema(data),
  };

  return payload;
}

export function getCommandResponse(vertex: Vertex): CommandPayload {
  const data = vertex
    .getOutgoing('dtmi:dtdl:property:response;2')
    .items()
    .map((edge) => edge?.to)
    .pop() as Vertex;

  const payload = {
    ...getBaseModelPropertiesFromVertex(data),
    name: getName(vertex),
    schema: inferSchema(data),
  };

  return payload;
}
