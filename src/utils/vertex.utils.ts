import { Vertex } from 'jsonld-graph';
import { ModelType, SchemaType } from '../models/models';

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

export function getTypes(vertex: Vertex, simplifyTypename = true): string[] {
  const dtdlRegex = /dtmi:dtdl:class:([A-Za-z]*);[1-9][0-9]{0,8}/g;
  if (!vertex) return [];
  return vertex
    .getTypes()
    .map((_v) => _v.id)
    .items()
    .map((typeName: string) => {
      if (!simplifyTypename) return typeName;
      const match = dtdlRegex.exec(typeName);
      return match ? match[1] : typeName;
    });
}

export function getType(vertex: Vertex): ModelType | SchemaType {
  if (!vertex) return SchemaType.Primitive;
  return vertex
    .getTypes()
    .map((_v) => _v.id)
    .first((i) => i.includes('Class')) as any;
}

export function getPropertyByName<T>(
  vertex: Vertex,
  propertyName: string,
  defaultValue: T
): T {
  if (!vertex) return defaultValue;
  return vertex.getAttributeValue<T>(`dtmi:dtdl:property:${propertyName};2`);
}
