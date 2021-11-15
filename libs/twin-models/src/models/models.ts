import { ContextType } from '../../../../apps/tributech-catalog/src/models/models';
import { SelfDescription } from './common';
import { SelfDescriptionType } from './constants';
import { Schema } from './schema';
import { SemanticType } from './semantic-type';

export class TwinMetadata {
  $model?: string;

  [key: string]: any;
}

export class TwinInstance {
  $dtId?: string;
  $etag?: string;
  $metadata?: TwinMetadata;

  [key: string]: any;
}

export class TwinRelationship {
  $relationshipId?: string;
  $targetId?: string;
  $sourceId?: string;
  $relationshipName?: string;
  $etag?: string;

  [key: string]: any;
}

export class TwinGraph {
  digitalTwins?: Array<TwinInstance>;
  relationships?: Array<TwinRelationship>;
}

export class DataFileInfoModel {
  fileVersion: string;
}

export class TwinFileModel {
  digitalTwinsFileInfo: DataFileInfoModel;
  digitalTwinsGraph: TwinGraph;
  digitalTwinsModels: Interface[];
  constructor() {
    this.digitalTwinsFileInfo = { fileVersion: '1.0.0' };
    this.digitalTwinsGraph = { digitalTwins: [], relationships: [] };
    this.digitalTwinsModels = [];
  }
}

export interface Telemetry extends SelfDescription {
  '@type':
    | SelfDescriptionType.Telemetry
    | [SemanticType, SelfDescriptionType.Telemetry]
    | [SelfDescriptionType.Telemetry, SemanticType];
  name: string;
  schema: Schema;
  unit?: string;
}

export interface Property extends SelfDescription {
  '@type':
    | SelfDescriptionType.Property
    | [SemanticType, SelfDescriptionType.Property]
    | [SelfDescriptionType.Property, SemanticType];
  name: string;
  schema: Schema; // may not be Array nor any complex schema that contains Array
  unit?: string;
  writable?: boolean;
}

export interface Command extends SelfDescription {
  '@type': SelfDescriptionType.Command;
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
  target?: string;
}

export interface Component extends SelfDescription {
  '@type': SelfDescriptionType.Component;
  name: string;
  schema: string;
}

export interface Interface extends SelfDescription {
  '@context': 'dtmi:dtdl:context;2';
  '@type': SelfDescriptionType.Interface;
  extends?: string[];
  contents?: SelfDescription[];
  schemas?: SelfDescription[];
}

export interface NormalizedInterface extends SelfDescription {
  '@context'?: 'dtmi:dtdl:context;2';
  '@type': SelfDescriptionType.Interface;
  extends?: string[];
  contents?: string[];
  schemas?: string[];
}

export interface ExpandedInterface extends SelfDescription {
  '@context': ContextType.DTDL2;
  bases?: string[];
  properties?: Property[];
  relationships?: Relationship[];
  telemetries?: Telemetry[];
  components?: Component[];
  commands?: Command[];
  schemas?: Schema[];
}

export interface InterfaceSchema extends SelfDescription {
  '@type':
    | SelfDescriptionType.Array
    | SelfDescriptionType.Enum
    | SelfDescriptionType.Map
    | SelfDescriptionType.Object;
}

export type InterfaceContent =
  | Telemetry
  | Property
  | Command
  | Relationship
  | Component
  | undefined;
