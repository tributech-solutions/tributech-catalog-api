export class DigitalTwinMetadata {
  $model?: string;
}

export class BaseDigitalTwin {
  [key: string]: any;

  $dtId?: string;
  $etag?: string;
  $metadata?: DigitalTwinMetadata;
}

export class BasicRelationship {
  [key: string]: any;

  $relationshipId?: string;
  $targetId?: string;
  $sourceId?: string;
  $relationshipName?: string;
  $etag?: string;
}

export class DigitalTwinModel {
  digitalTwins?: Array<BaseDigitalTwin>;
  relationships?: Array<BasicRelationship>;
}

export class ExpandedInterface {
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

export class ArraySchema {
  '@type': 'Array';
  elementSchema: Schema;
  '@id'?: string;
  comment?: string;
  description?: string;
  displayName?: string;
}

export class EnumValue {
  name: string;
  enumValue: string | number;
  '@id'?: string;
  comment?: string;
  description?: string;
  displayName?: string;
}

export class EnumSchema {
  '@type': 'Enum';
  enumValues: EnumValue[];
  valueSchema: 'integer' | 'string' | string;
  '@id'?: string;
  comment?: string;
  description?: string;
  displayName?: string;
}

export class MapKey {
  name: string;
  schema: 'string' | string;
  '@id'?: string;
  comment?: string;
  description?: string;
  displayName?: string;
}

export class MapValue {
  name: string;
  schema: Schema;
  '@id'?: string;
  comment?: string;
  description?: string;
  displayName?: string;
}

export class MapSchema {
  '@type': 'Map';
  mapKey: MapKey;
  mapValue: MapValue;
  '@id'?: string;
  comment?: string;
  description?: string;
  displayName?: string;
}

export class Field {
  name: string;
  schema: Schema;
  '@id'?: string;
  comment?: string;
  description?: string;
  displayName?: string;
}

export class ObjectSchema {
  '@type': 'Object';
  fields: Field[];
  '@id'?: string;
  comment?: string;
  description?: string;
  displayName?: string;
}

export class Telemetry {
  '@type': 'Telemetry' | ['Telemetry', string];
  // https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#digital-twin-model-identifier
  name: string;
  schema: Schema;
  '@id'?: string; // DTMI
  comment?: string;
  description?: string;
  displayName?: string;
  unit?: string;
}

export class Property {
  '@type': 'Property' | ['Property', string];
  // https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#digital-twin-model-identifier
  name: string;
  schema: Schema; // may not be Array nor any complex schema that contains Array
  '@id'?: string; // DTMI
  comment?: string;
  description?: string;
  displayName?: string;
  unit?: string;
  writable?: boolean;
}

export class Command {
  '@type': 'Command';
  // https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#digital-twin-model-identifier
  name: string;
  '@id'?: string; // DTMI
  comment?: string;
  description?: string;
  displayName?: string;
  commandType?: any;
  request?: any;
  response?: any;
}

export class Relationship {
  '@type': 'Relationship';
  name: string;
  '@id'?: string; // DTMI
  comment?: string;
  description?: string;
  displayName?: string;
  maxMultiplicity?: number;
  minMultiplicity?: number;
  properties?: Property[];
  target?: string | Interface;
}

export class Component {
  '@type': 'Component';
  name: string;
  schema: Interface;
  '@id'?: string; // DTMI
  comment?: string;
  description?: string;
  displayName?: string;
}

export type InterfaceContent =
  | Telemetry
  | Property
  | Command
  | Relationship
  | Component
  | undefined;

export class Interface {
  '@type': 'Interface';
  '@id': string;
  '@context': 'dtmi:dtdl:context;2';
  comment?: string;
  description?: string;
  displayName?: string;
  contents?: InterfaceContent[];
  extends?: string[] | Interface[] | string;
  schemas?: InterfaceSchema[];
}

export class InterfaceSchema {
  '@type': 'Array' | 'Enum' | 'Map' | 'Object';
  '@id': string;
  comment: string;
  description: string;
  displayName: string;
}
