import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { SemanticTypes } from './semantic-types';

export enum InterfaceType {
  Interface = 'Interface',
}

export enum ContextType {
  DTDL2 = 'dtmi:dtdl:context;2',
}

export enum ModelType {
  Property = 'Property',
  Telemetry = 'Telemetry',
  Command = 'Command',
  Component = 'Component',
  Relationship = 'Relationship',
}

export enum SchemaType {
  Enum = 'Enum',
  Map = 'Map',
  Object = 'Object',
  Array = 'Array',
}

export class DigitalTwinMetadata {
  @ApiProperty({
    required: true,
    nullable: false,
    pattern: '^dtmi:[a-z:]*;[1-99]$',
  })
  $model?: string;
}

export class BaseDigitalTwin {
  [key: string]: any;

  @ApiProperty()
  $dtId?: string;
  @ApiProperty()
  $etag?: string;
  @ApiProperty()
  $metadata?: DigitalTwinMetadata;
}

export class BasicRelationship {
  [key: string]: any;

  @ApiProperty()
  $relationshipId?: string;
  @ApiProperty()
  $targetId?: string;
  @ApiProperty()
  $sourceId?: string;
  @ApiProperty()
  $relationshipName?: string;
  @ApiProperty()
  $etag?: string;
}

export class DigitalTwinModel {
  @ApiProperty({ type: [BaseDigitalTwin] })
  digitalTwins?: Array<BaseDigitalTwin>;
  @ApiProperty({ type: [BasicRelationship] })
  relationships?: Array<BasicRelationship>;
}

export class BaseModel {
  @ApiProperty({ nullable: false, required: true })
  '@id'?: string;
  @ApiProperty({ required: false })
  comment?: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  displayName?: string;
}

export class ModelContent extends BaseModel {
  @ApiProperty({ nullable: false, required: true })
  '@type'?: ModelType | [ModelType, SemanticTypes];
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

@ApiExtraModels(
  () => ArraySchema,
  () => EnumSchema,
  () => MapSchema,
  () => ObjectSchema
)
export class ArraySchema extends BaseModel {
  @ApiProperty({ type: 'string', enum: [SchemaType.Array] })
  '@type': SchemaType.Array;
  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath('ArraySchema') },
      { $ref: getSchemaPath('EnumSchema') },
      { $ref: getSchemaPath('MapSchema') },
      { $ref: getSchemaPath('ObjectSchema') },
    ],
  })
  elementSchema: Schema;
}

export class EnumValue extends BaseModel {
  @ApiProperty()
  name: string;
  @ApiProperty()
  enumValue: string | number;
}

export class EnumSchema extends BaseModel {
  @ApiProperty({ type: 'string', enum: [SchemaType.Enum] })
  '@type': SchemaType.Enum;
  @ApiProperty({ type: [EnumValue] })
  enumValues: EnumValue[];
  @ApiProperty()
  valueSchema: 'integer' | 'string' | string;
}

export class MapKey extends BaseModel {
  @ApiProperty()
  name: string;
  @ApiProperty()
  schema: 'string' | string;
}

@ApiExtraModels(ArraySchema, EnumSchema, () => MapSchema, () => ObjectSchema)
export class MapValue extends BaseModel {
  @ApiProperty()
  name: string;
  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath('ArraySchema') },
      { $ref: getSchemaPath('EnumSchema') },
      { $ref: getSchemaPath('MapSchema') },
      { $ref: getSchemaPath('ObjectSchema') },
    ],
  })
  schema: Schema;
}

export class MapSchema extends BaseModel {
  @ApiProperty({ type: 'string', enum: [SchemaType.Map] })
  '@type': SchemaType.Map;
  @ApiProperty()
  mapKey: MapKey;
  @ApiProperty()
  mapValue: MapValue;
}

@ApiExtraModels(ArraySchema, EnumSchema, MapSchema, () => ObjectSchema)
export class Field extends BaseModel {
  @ApiProperty()
  name: string;
  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath('ArraySchema') },
      { $ref: getSchemaPath('EnumSchema') },
      { $ref: getSchemaPath('MapSchema') },
      { $ref: getSchemaPath('ObjectSchema') },
    ],
  })
  schema: Schema;
}

export class ObjectSchema extends BaseModel {
  @ApiProperty({ type: 'string', enum: [SchemaType.Object] })
  '@type': SchemaType.Object;
  @ApiProperty({ type: [Field] })
  fields: Field[];
}

@ApiExtraModels(ArraySchema, EnumSchema, MapSchema, ObjectSchema)
export class Telemetry extends ModelContent {
  @ApiProperty({
    oneOf: [
      { type: 'string', enum: [ModelType.Telemetry] },
      {
        type: 'array',
        items: {
          type: 'string',
          enum: [ModelType.Telemetry, ...Object.keys(SemanticTypes)],
        },
      },
    ],
  })
  '@type': ModelType.Telemetry | [ModelType.Telemetry, SemanticTypes];
  @ApiProperty()
  name: string;

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { $ref: getSchemaPath(ArraySchema) },
      { $ref: getSchemaPath(EnumSchema) },
      { $ref: getSchemaPath(MapSchema) },
      { $ref: getSchemaPath(ObjectSchema) },
    ],
  })
  schema: Schema;
  @ApiProperty()
  unit?: string;
}

@ApiExtraModels(ArraySchema, EnumSchema, MapSchema, ObjectSchema)
export class Property extends BaseModel {
  @ApiProperty({
    oneOf: [
      { type: 'string', enum: [ModelType.Property] },
      {
        type: 'array',
        items: {
          type: 'string',
          enum: [ModelType.Property, ...Object.keys(SemanticTypes)],
        },
      },
    ],
  })
  '@type': ModelType.Property | [ModelType.Property, SemanticTypes];
  @ApiProperty()
  name: string;
  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(ArraySchema) },
      { $ref: getSchemaPath(EnumSchema) },
      { $ref: getSchemaPath(MapSchema) },
      { $ref: getSchemaPath(ObjectSchema) },
    ],
  })
  schema: Schema;
  @ApiProperty()
  unit?: string;
  @ApiProperty()
  writable?: boolean;
}

export class Command extends BaseModel {
  @ApiProperty({ type: 'string', enum: [ModelType.Command] })
  '@type': ModelType.Command;
  @ApiProperty()
  name: string;
  @ApiProperty()
  commandType?: any;
  @ApiProperty()
  request?: any;
  @ApiProperty()
  response?: any;
}

export class Relationship extends BaseModel {
  @ApiProperty({ type: 'string', enum: [ModelType.Relationship] })
  '@type': ModelType.Relationship;
  @ApiProperty()
  name: string;
  @ApiProperty()
  maxMultiplicity?: number;
  @ApiProperty()
  minMultiplicity?: number;
  @ApiProperty({ type: [Property] })
  properties?: Property[];
  @ApiProperty({ type: 'string' })
  target?: string | Interface;
}

export class Component extends BaseModel {
  @ApiProperty({ type: 'string', enum: [ModelType.Component] })
  '@type': ModelType.Component;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: () => Interface })
  schema: string | Interface;
}

export type InterfaceContent =
  | Telemetry
  | Property
  | Command
  | Relationship
  | Component
  | undefined;

export class InterfaceSchema extends BaseModel {
  @ApiProperty({ type: 'string', enum: SchemaType })
  '@type': SchemaType;
  @ApiProperty()
  '@id': string;
}

@ApiExtraModels(Property, Relationship, Component, Command)
export class Interface extends BaseModel {
  @ApiProperty({ type: 'string', enum: InterfaceType })
  '@type': InterfaceType.Interface;
  @ApiProperty({ type: 'string', enum: ContextType })
  '@context': ContextType.DTDL2;
  @ApiProperty()
  '@id': string;
  @ApiProperty({
    type: 'array',
    items: {
      anyOf: [
        { $ref: getSchemaPath(Property) },
        { $ref: getSchemaPath(Relationship) },
        { $ref: getSchemaPath(Component) },
        { $ref: getSchemaPath(Command) },
      ],
    },
  })
  contents?: InterfaceContent[];
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  extends?: string[] | Interface[] | string;
  @ApiProperty({ type: [InterfaceSchema] })
  schemas?: InterfaceSchema[];
}

@ApiExtraModels(ArraySchema, EnumSchema, MapSchema, ObjectSchema)
export class ExpandedInterface extends BaseModel {
  @ApiProperty({ type: 'string', enum: InterfaceType })
  '@type': InterfaceType.Interface;
  @ApiProperty({ type: 'string', enum: ContextType })
  '@context': ContextType.DTDL2;
  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(ArraySchema) },
      { $ref: getSchemaPath(EnumSchema) },
      { $ref: getSchemaPath(MapSchema) },
      { $ref: getSchemaPath(ObjectSchema) },
    ],
  })
  schema?: Schema;
  @ApiProperty({ type: 'array', items: { type: 'string' } })
  bases?: string[];
  @ApiProperty({ type: [Property] })
  properties: Property[];
  @ApiProperty({ type: [Relationship] })
  relationships?: Relationship[];
  @ApiProperty({ type: [Telemetry] })
  telemetries?: Telemetry[];
  @ApiProperty({ type: [Component] })
  components?: Component[];
}
