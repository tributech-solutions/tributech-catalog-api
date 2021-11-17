import { SelfDescription } from './common';
import { SelfDescriptionType } from './constants';

export type Schema =
  | PrimitiveSchema
  | ArraySchema
  | EnumSchema
  | MapSchema
  | ObjectSchema
  | undefined;

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
