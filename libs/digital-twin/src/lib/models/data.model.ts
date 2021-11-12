import { isArray, isString } from '@datorama/akita';
import { toEnumIgnoreCase } from '@tributech/core';

export interface DigitalTwinMetadata {
  $model?: string;
}

export interface BaseDigitalTwin {
  [key: string]: any;

  $dtId?: string;
  $etag?: string;
  $metadata?: DigitalTwinMetadata;
}

export interface BasicRelationship {
  [key: string]: any;

  $relationshipId?: string;
  $targetId?: string;
  $sourceId?: string;
  $relationshipName?: string;
  $etag?: string;
}

export interface DigitalTwinModel {
  digitalTwins?: Array<BaseDigitalTwin>;
  relationships?: Array<BasicRelationship>;
}

export class TwinDataModel {
  digitalTwinsFileInfo: DataFileInfoModel;
  digitalTwinsGraph: DigitalTwinModel;
  digitalTwinsModels: Interface[];
  constructor() {
    this.digitalTwinsFileInfo = { fileVersion: '1.0.0' };
    this.digitalTwinsGraph = { digitalTwins: [], relationships: [] };
    this.digitalTwinsModels = [];
  }
}

export class DataFileInfoModel {
  fileVersion: string; // should be "1.0.0"
}

export type TwinModel = Interface;

export interface ExpandedTwinModel {
  '@id': string;
  '@type': 'Interface';
  '@context': 'dtmi:dtdl:context;2';
  displayName?: string;
  description?: string;
  comment?: string;
  schema?: Schema;
  bases?: string[];
  properties: Property[];
  relationships?: Relationship[];
  telemetries?: Telemetry[];
  components?: Component[];
}

export type Schema =
  | PrimitiveSchema
  | ArraySchema
  | EnumSchema
  | MapSchema
  | ObjectSchema;

export type PrimitiveSchema =
  | 'date'
  | 'dateTime'
  | 'duration'
  | PrimitiveBooleanSchema
  | PrimitiveStringSchema
  | PrimitiveNumberSchema;

export type PrimitiveNumberSchema =
  | 'dtmi:dtdl:instance:Schema:double;2'
  | 'dtmi:dtdl:instance:Schema:integer;2'
  | 'dtmi:dtdl:instance:Schema:long;2'
  | 'dtmi:dtdl:instance:Schema:float;2'
  | 'double'
  | 'integer'
  | 'long'
  | 'float';

export type PrimitiveStringSchema =
  | 'string'
  | 'dtmi:dtdl:instance:Schema:string;2';

export type PrimitiveBooleanSchema =
  | 'boolean'
  | 'dtmi:dtdl:instance:Schema:boolean;2';

export interface ArraySchema extends SelfDescription {
  '@type': SelfDescriptionType.Array;
  elementSchema: Schema;
}

export interface EnumValue extends SelfDescription {
  name: string;
  enumValue: string | number;
}

export interface EnumSchema extends SelfDescription {
  '@type': SelfDescriptionType.Enum;
  enumValues: EnumValue[];
  valueSchema: 'integer' | 'string' | string;
}

export interface MapKey extends SelfDescription {
  name: string;
  schema: 'string' | string;
}

export interface MapValue extends SelfDescription {
  name: string;
  schema: Schema;
}

export interface MapSchema extends SelfDescription {
  '@type': SelfDescriptionType.Map;
  mapKey: MapKey;
  mapValue: MapValue;
}

export interface Field extends SelfDescription {
  name: string;
  schema: Schema;
}

export interface ObjectSchema extends SelfDescription {
  '@type': SelfDescriptionType.Object;
  fields: Field[];
}

export interface Telemetry extends SelfDescription {
  '@type':
    | SelfDescriptionType.Telemetry
    | [SelfDescriptionType.Telemetry, string];
  // https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#digital-twin-model-identifier
  name: string;
  schema: Schema;
  unit?: string;
}

export interface Property extends SelfDescription {
  '@type':
    | SelfDescriptionType.Property
    | [SelfDescriptionType.Property, string];
  // https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#digital-twin-model-identifier
  name: string;
  schema: Schema; // may not be Array nor any complex schema that contains Array
  unit?: string;
  writable?: boolean;
}

export interface Command extends SelfDescription {
  '@type': SelfDescriptionType.Command;
  // https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#digital-twin-model-identifier
  name: string;
  commandType?: string;
  request?: CommandPayload;
  response?: CommandPayload;
}

export interface CommandPayload extends SelfDescription {
  name: string;
  schema: Schema;
}

export interface Relationship extends SelfDescription {
  '@type': SelfDescriptionType.Relationship;
  name: string;
  maxMultiplicity?: number;
  minMultiplicity?: number;
  properties?: Property[];
  target?: string | Interface;
}

export interface Component extends SelfDescription {
  '@type': SelfDescriptionType.Component;
  name: string;
  schema: Interface;
}

export interface Interface extends SelfDescription {
  '@type': SelfDescriptionType.Interface;
  '@context': 'dtmi:dtdl:context;2';
  contents?: SelfDescription[];
  extends?: string[];
  schemas?: SelfDescription[];
}

export interface NormalizedInterface extends SelfDescription {
  '@type': SelfDescriptionType.Interface;
  '@context'?: 'dtmi:dtdl:context;2';
  contents?: string[];
  extends?: string[];
  schemas?: string[];
}

export interface SelfDescription {
  '@id'?: string;
  '@type'?:
    | SelfDescriptionType
    | [SelfDescriptionType, string]
    | [string, SelfDescriptionType];
  comment?: string;
  description?: string;
  displayName?: string;
  [key: string]: any;
}

export enum SelfDescriptionType {
  Interface = 'Interface',
  Property = 'Property',
  Relationship = 'Relationship',
  Telemetry = 'Telemetry',
  Component = 'Component',
  Command = 'Command',
  Array = 'Array',
  Enum = 'Enum',
  Map = 'Map',
  Object = 'Object',
}

export interface InterfaceSchema extends SelfDescription {
  '@type':
    | SelfDescriptionType.Array
    | SelfDescriptionType.Enum
    | SelfDescriptionType.Map
    | SelfDescriptionType.Object;
}

export function isInterfaceSD(sd: SelfDescription): sd is Interface {
  const types = sd?.['@type'];
  return isArray(types) ? types.includes('Interface') : types === 'Interface';
}

export function getDTDLType(
  type:
    | string
    | SelfDescriptionType
    | [SelfDescriptionType, string]
    | [string, SelfDescriptionType]
): SelfDescriptionType {
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

  if (!type) return null;

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
  return isSchemaType(types);
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
  return isContentType(types);
}

export function isSchemaType(
  type: string | string[] | SelfDescriptionType | SelfDescriptionType[]
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
  type: string | string[] | SelfDescriptionType | SelfDescriptionType[]
): boolean {
  const validTypes = [
    SelfDescriptionType.Property.toString(),
    SelfDescriptionType.Relationship.toString(),
    SelfDescriptionType.Command.toString(),
    SelfDescriptionType.Component.toString(),
    SelfDescriptionType.Telemetry.toString(),
  ];

  if (!type) return false;

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

  if (!type) return null;

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

  if (!type) return null;

  if (isArray(type) && type.every((t) => isString(t))) {
    return type.filter((t) => validTypes.includes(t.toString()))[0];
  }
  return type.toString();
}
