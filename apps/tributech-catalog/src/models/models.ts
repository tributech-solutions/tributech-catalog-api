import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ArraySchema as IArraySchema,
  Command as ICommand,
  Component as IComponent,
  ContextType,
  DTMI_REGEX,
  EnumSchema as IEnumSchema,
  ExpandedInterface as IExpandedInterface,
  Interface as IInterface,
  InterfaceSchema as IInterfaceSchema,
  MapSchema as IMapSchema,
  ObjectSchema as IObjectSchema,
  Property as IProperty,
  Relationship as IRelationship,
  Schema,
  SelfDescription as ISelfDescription,
  SelfDescriptionType,
  SemanticType,
  Telemetry as ITelemetry,
  TwinInstance as ITwinInstance,
  TwinMetadata as ITwinMetadata,
  TwinRelationship as ITwinRelationship,
} from '@tributech/self-description';

export class TwinMetadata implements ITwinMetadata {
  @ApiProperty({
    required: true,
    nullable: false,
    pattern: DTMI_REGEX,
  })
  $model?: string;
}

export class TwinInstance implements ITwinInstance {
  @ApiProperty()
  $dtId?: string;
  @ApiProperty()
  $etag?: string;
  @ApiProperty()
  $metadata?: TwinMetadata;

  [key: string]: any;
}

export class TwinRelationship implements ITwinRelationship {
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

  [key: string]: any;
}

export class TwinGraph {
  @ApiProperty({ type: [TwinInstance] })
  digitalTwins?: Array<TwinInstance>;
  @ApiProperty({ type: [TwinRelationship] })
  relationships?: Array<TwinRelationship>;
}

export class DataFileInfoModel {
  @ApiProperty()
  fileVersion: string;
}

export class SelfDescription implements ISelfDescription {
  @ApiPropertyOptional()
  '@id'?: string;
  @ApiPropertyOptional({
    nullable: false,
    required: true,
    type: 'array',
    items: {
      type: 'string',
      enum: [...Object.keys(SelfDescriptionType), ...Object.keys(SemanticType)],
    },
  })
  '@type'?:
    | SelfDescriptionType
    | [SelfDescriptionType, SemanticType]
    | [SemanticType, SelfDescriptionType];
  @ApiPropertyOptional({ required: false })
  comment?: string;
  @ApiPropertyOptional({ required: false })
  description?: string;
  @ApiPropertyOptional({ required: false })
  displayName?: string;
}

@ApiExtraModels(
  () => ArraySchema,
  () => EnumSchema,
  () => MapSchema,
  () => ObjectSchema
)
export class ArraySchema extends SelfDescription implements IArraySchema {
  '@type': SelfDescriptionType.Array;
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

export class EnumValue extends SelfDescription {
  @ApiProperty()
  name: string;
  @ApiProperty()
  enumValue: string | number;
}

export class EnumSchema extends SelfDescription implements IEnumSchema {
  '@type': SelfDescriptionType.Enum;
  @ApiProperty({ type: [EnumValue] })
  enumValues: EnumValue[];
  @ApiProperty()
  valueSchema: 'integer' | 'string' | string;
}

export class MapKey extends SelfDescription {
  @ApiProperty()
  name: string;
  @ApiProperty()
  schema: 'string' | string;
}

@ApiExtraModels(ArraySchema, EnumSchema, () => MapSchema, () => ObjectSchema)
export class MapValue extends SelfDescription {
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

export class MapSchema extends SelfDescription implements IMapSchema {
  '@type': SelfDescriptionType.Map;
  @ApiProperty()
  mapKey: MapKey;
  @ApiProperty()
  mapValue: MapValue;
}

@ApiExtraModels(ArraySchema, EnumSchema, MapSchema, () => ObjectSchema)
export class Field extends SelfDescription {
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

export class ObjectSchema extends SelfDescription implements IObjectSchema {
  '@type': SelfDescriptionType.Object;
  @ApiProperty({ type: [Field] })
  fields: Field[];
}

@ApiExtraModels(ArraySchema, EnumSchema, MapSchema, ObjectSchema)
export class Telemetry extends SelfDescription implements ITelemetry {
  '@type':
    | SelfDescriptionType.Telemetry
    | [SemanticType, SelfDescriptionType.Telemetry]
    | [SelfDescriptionType.Telemetry, SemanticType];
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
  @ApiPropertyOptional()
  unit?: string;
  @ApiProperty()
  name: string;
}

@ApiExtraModels(ArraySchema, EnumSchema, MapSchema, ObjectSchema)
export class Property extends SelfDescription implements IProperty {
  '@type':
    | SelfDescriptionType.Property
    | [SemanticType, SelfDescriptionType.Property]
    | [SelfDescriptionType.Property, SemanticType];
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
  @ApiPropertyOptional()
  unit?: string;
  @ApiPropertyOptional()
  writable?: boolean;
}

export class CommandPayload extends SelfDescription {
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
  name: string;
}

export class Command extends SelfDescription implements ICommand {
  '@type': SelfDescriptionType.Command;
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  request?: CommandPayload;
  @ApiPropertyOptional()
  response?: CommandPayload;
}

export class Relationship extends SelfDescription implements IRelationship {
  '@type': SelfDescriptionType.Relationship;
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  maxMultiplicity?: number;
  @ApiPropertyOptional()
  minMultiplicity?: number;
  @ApiPropertyOptional({ type: [Property], nullable: true })
  properties?: Property[];
  @ApiPropertyOptional({ type: 'string' })
  target?: string;
  @ApiPropertyOptional()
  writable?: boolean;
}

export class Component extends SelfDescription implements IComponent {
  '@type': SelfDescriptionType.Component;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: () => Interface })
  schema: string;
}

export type InterfaceContent =
  | Telemetry
  | Property
  | Command
  | Relationship
  | Component;

export class InterfaceSchema
  extends SelfDescription
  implements IInterfaceSchema
{
  '@type':
    | SelfDescriptionType.Array
    | SelfDescriptionType.Enum
    | SelfDescriptionType.Map
    | SelfDescriptionType.Object;
}

@ApiExtraModels(Property, Relationship, Component, Command, Telemetry)
export class Interface extends SelfDescription implements IInterface {
  @ApiProperty({ type: 'string', enum: ContextType })
  '@context': ContextType.DTDL2;
  '@type': SelfDescriptionType.Interface;
  @ApiPropertyOptional({
    type: 'array',
    items: {
      anyOf: [
        { $ref: getSchemaPath(Property) },
        { $ref: getSchemaPath(Relationship) },
        { $ref: getSchemaPath(Component) },
        { $ref: getSchemaPath(Telemetry) },
        { $ref: getSchemaPath(Command) },
      ],
    },
    nullable: true,
  })
  contents?: InterfaceContent[];
  @ApiPropertyOptional({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    nullable: true,
  })
  extends: string[];
  @ApiPropertyOptional({ type: [InterfaceSchema], nullable: true })
  schemas: InterfaceSchema[];
}

export class ExpandedInterface implements IExpandedInterface {
  @ApiProperty({ type: 'string', enum: ContextType })
  '@context': ContextType.DTDL2;
  '@type': SelfDescriptionType.Interface;
  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string' },
    nullable: true,
  })
  bases?: string[];
  @ApiPropertyOptional({ type: [Property] })
  properties?: Property[];
  @ApiPropertyOptional({ type: [Relationship] })
  relationships?: Relationship[];
  @ApiPropertyOptional({ type: [Telemetry] })
  telemetries?: Telemetry[];
  @ApiPropertyOptional({ type: [Component] })
  components?: Component[];
  @ApiPropertyOptional({ type: [Command] })
  commands?: Command[];
  @ApiPropertyOptional({ type: [InterfaceSchema] })
  schemas?: InterfaceSchema[];
}

export class TwinFileModel {
  @ApiProperty({ type: DataFileInfoModel })
  digitalTwinsFileInfo: DataFileInfoModel;
  @ApiProperty({ type: TwinGraph })
  digitalTwinsGraph: TwinGraph;
  @ApiProperty({ type: [Interface] })
  digitalTwinsModels: Interface[];
  constructor() {
    this.digitalTwinsFileInfo = { fileVersion: '1.0.0' };
    this.digitalTwinsGraph = { digitalTwins: [], relationships: [] };
    this.digitalTwinsModels = [];
  }
}
