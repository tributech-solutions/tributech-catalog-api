import { Vertex } from 'jsonld-graph';
import { CommandPayload, ModelType, SchemaType } from '../models/models';
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
): string | string[] {
  const dtdlRegex = /dtmi:dtdl:class:([A-Za-z]*);[1-9][0-9]{0,8}/g;
  if (!vertex) return [];
  const types = vertex
    .getTypes()
    .map((_v) => _v.id)
    .items()
    .map((typeName: string) => {
      if (!simplifyTypename) return typeName;
      const match = dtdlRegex.exec(typeName);
      return match ? match[1] : typeName;
    });
  return types.length === 1 ? types[0] : types;
}

export function getType(vertex: Vertex): ModelType | SchemaType {
  if (!vertex) return SchemaType.Primitive;
  return vertex
    .getTypes()
    .map((_v) => _v.id)
    .first((i) => i.includes('Class')) as ModelType | SchemaType;
}

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
    schema: inferSchema(data),
  };

  return payload;
}
