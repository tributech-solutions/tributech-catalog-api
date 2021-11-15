import { isArray, isString } from '@datorama/akita';
import { SelfDescription } from '../models/common';
import { RelationType, SelfDescriptionType } from '../models/constants';
import {
  Command,
  Component,
  Interface,
  InterfaceSchema,
  Property,
  Relationship,
  Telemetry,
  TwinFileModel,
  TwinGraph,
  TwinInstance,
  TwinRelationship,
} from '../models/models';
import { SemanticType } from '../models/semantic-type';
import { uuidv4 } from './dtml.utils';
import { toEnumIgnoreCase } from './enum.utils';

export function isInterfaceSD(sd: SelfDescription): sd is Interface {
  const types = sd?.['@type'];
  return isArray(types)
    ? types.includes(SelfDescriptionType.Interface)
    : types === SelfDescriptionType.Interface;
}

export function getDTDLType(
  type:
    | SelfDescriptionType
    | [SelfDescriptionType, SemanticType]
    | [SemanticType, SelfDescriptionType]
): SelfDescriptionType | null | undefined {
  const validTypes = [
    SelfDescriptionType.Array,
    SelfDescriptionType.Enum,
    SelfDescriptionType.Map,
    SelfDescriptionType.Object,
    SelfDescriptionType.Property,
    SelfDescriptionType.Relationship,
    SelfDescriptionType.Command,
    SelfDescriptionType.Component,
    SelfDescriptionType.Telemetry,
  ];

  if (!type) throw new Error('No type found!');

  if (isArray(type) && type.every((t) => isString(t))) {
    return toEnumIgnoreCase(
      SelfDescriptionType,
      type.filter((t) => validTypes.includes(t as any))[0]
    );
  }

  if (isArray(type)) return null;

  return toEnumIgnoreCase(SelfDescriptionType, type);
}

export function isCommandSD(sd: SelfDescription): sd is Command {
  const types = sd?.['@type'];
  return !isArray(types) && types === 'Command';
}

export function isSchemaSD(sd: SelfDescription): sd is InterfaceSchema {
  const types = sd?.['@type'];
  return isSchemaType(types as any);
}

export type ContentSD =
  | Property
  | Relationship
  | Command
  | Component
  | Telemetry;

export function isContentSD(
  sd: SelfDescription
): sd is Property | Relationship | Command | Component | Telemetry {
  const types = sd?.['@type'];
  return isContentType(types as any);
}

export function isSchemaType(
  type:
    | SelfDescriptionType
    | [SelfDescriptionType, SemanticType]
    | [SemanticType, SelfDescriptionType]
): boolean {
  const validTypes = [
    SelfDescriptionType.Array.toString(),
    SelfDescriptionType.Enum.toString(),
    SelfDescriptionType.Map.toString(),
    SelfDescriptionType.Object.toString(),
  ];

  if (!type) return false;

  if (isArray(type) && type.every((t) => isString(t))) {
    return type.some((t) => validTypes.includes(t.toString()));
  }
  return validTypes.includes(type.toString());
}

export function isContentType(
  type:
    | SelfDescriptionType
    | [SelfDescriptionType, SemanticType]
    | [SemanticType, SelfDescriptionType]
): boolean {
  const validTypes = [
    SelfDescriptionType.Property.toString(),
    SelfDescriptionType.Relationship.toString(),
    SelfDescriptionType.Command.toString(),
    SelfDescriptionType.Component.toString(),
    SelfDescriptionType.Telemetry.toString(),
  ];

  if (!type) throw Error('No type found!');

  if (isArray(type) && type.every((t) => isString(t))) {
    return type.some((t) => validTypes.includes(t.toString()));
  }
  return validTypes.includes(type.toString());
}

export function getContentType(
  type: string | string[] | SelfDescriptionType | SelfDescriptionType[]
): string {
  const validTypes = [
    SelfDescriptionType.Property.toString(),
    SelfDescriptionType.Relationship.toString(),
    SelfDescriptionType.Command.toString(),
    SelfDescriptionType.Component.toString(),
    SelfDescriptionType.Telemetry.toString(),
  ];

  if (!type) throw new Error('No type present!');

  if (isArray(type) && type.every((t) => isString(t))) {
    return type.filter((t) => validTypes.includes(t.toString()))[0];
  }
  return type.toString();
}

export function getSchemaType(
  type: string | string[] | SelfDescriptionType | SelfDescriptionType[]
): string {
  const validTypes = [
    SelfDescriptionType.Array.toString(),
    SelfDescriptionType.Enum.toString(),
    SelfDescriptionType.Map.toString(),
    SelfDescriptionType.Object.toString(),
  ];

  if (!type) throw new Error('No type present!');

  if (isArray(type) && type.every((t) => isString(t))) {
    return type.filter((t) => validTypes.includes(t.toString()))[0];
  }
  return type.toString();
}

export function createEmptyTwin(modelId: string): TwinInstance {
  return {
    $dtId: uuidv4(),
    $etag: createETag(),
    $metadata: {
      $model: modelId,
    },
  };
}

export function createEmptyRelationship(
  relationshipName: string,
  sourceId: string,
  targetId: string
): TwinRelationship {
  return {
    $relationshipId: uuidv4(),
    $etag: createETag(),
    $sourceId: sourceId,
    $relationshipName: relationshipName,
    $targetId: targetId,
  };
}

export function createETag() {
  return `W/"${uuidv4()}"`;
}

export function filterRelType(
  rel: TwinRelationship,
  twinId: string,
  relationshipType: RelationType
): boolean {
  switch (relationshipType) {
    case RelationType.All:
      return rel?.$sourceId === twinId || rel?.$targetId === twinId;
    case RelationType.Source:
      return rel?.$sourceId === twinId;
    case RelationType.Target:
      return rel?.$targetId === twinId;
  }
}

export function ensureIsTwinGraph(data: any): data is TwinFileModel {
  return !!data?.digitalTwins && !!data?.relationships;
}

export function mapToRelevantData(data: any): TwinGraph {
  return ensureIsTwinGraph(data) ? data : data?.digitalTwinsGraph;
}

export function isValidModel(data: any) {
  return !!data?.['@context'] && !!data?.['@id'] && !!data?.['@type'];
}

export function convertDTMIToNeo4jLabel(dtmi: string): string {
  // eslint-disable-next-line prefer-const
  let [_dtmi, _version] = dtmi?.replace('dtmi:', '').split(';');
  _dtmi = _dtmi.split('_').map(capitalizeFirstLetter).join('');
  const reversedDTMI = _dtmi?.split(':').reverse().map(capitalizeFirstLetter);

  return `${reversedDTMI?.join('')}V${_version}`;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
