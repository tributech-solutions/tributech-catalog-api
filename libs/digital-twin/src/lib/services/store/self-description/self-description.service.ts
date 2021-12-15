import { Injectable } from '@angular/core';
import {
  applyTransaction,
  arrayAdd,
  isObject,
  isString,
  OrArray,
} from '@datorama/akita';
import {
  ArraySchema,
  Command,
  CommandPayload,
  Component,
  EnumSchema,
  getDTDLType,
  Interface,
  isInterfaceSD,
  MapSchema,
  ObjectSchema,
  Property,
  Relationship,
  Schema,
  SelfDescription,
  SelfDescriptionType,
  Telemetry,
} from '@tributech/self-description';
import { cloneDeep, forEach } from 'lodash';
import { ensureIDPresent } from './self-description.normalizer';
import { SelfDescriptionQuery } from './self-description.query';
import { SelfDescriptionStore } from './self-description.store';

export enum ChildLinkTarget {
  CONTENTS = 'contents',
  SCHEMAS = 'schemas',
}

@Injectable({ providedIn: 'root' })
export class SelfDescriptionService {
  constructor(
    private selfDescriptionStore: SelfDescriptionStore,
    private selfDescriptionQuery: SelfDescriptionQuery
  ) {}

  add(models: SelfDescription[]) {
    this.selfDescriptionStore.upsertMany(models);
  }

  addInterfaces(models: Interface[]) {
    models.forEach((m) => this.normalizeInterface(m));
  }

  update(model: SelfDescription) {
    this.selfDescriptionStore.upsert(model?.['@id'], model);
  }

  delete(id: OrArray<string>) {
    this.selfDescriptionStore.remove(id);
  }

  addAndLink(
    anchor: SelfDescription,
    newSD: SelfDescription,
    targetProp: ChildLinkTarget
  ) {
    this.add([newSD]);

    const updatedAnchor =
      cloneDeep(this.selfDescriptionQuery.getEntity(anchor?.['@id'])) || anchor;
    if (!updatedAnchor[targetProp]) {
      updatedAnchor[targetProp] = [];
    }
    updatedAnchor[targetProp] = arrayAdd(
      updatedAnchor[targetProp],
      newSD?.['@id']
    );
    this.update(updatedAnchor);
  }

  private normalizeInterface = (_sd: Interface) => {
    if (!isInterfaceSD(_sd)) throw new Error('Not of type Interface!');
    if (!_sd?.['@id']) throw new Error('No @id present!');

    const sd = cloneDeep(_sd);
    const contents = sd?.contents;
    const schemas = sd?.schemas;
    // remove nested entities so we dont persist them accidentally
    sd.contents = [];
    sd.schemas = [];

    applyTransaction(() => {
      const contentIRIs: string[] = [];
      const schemaIRIs: string[] = [];
      this.normalizeContents(contents, sd['@id'], sd, contentIRIs, schemaIRIs);
      this.normalizeSchemas(schemas, sd, contentIRIs, schemaIRIs);

      const latestVersion: any = sd as any;

      latestVersion.contents = [...contentIRIs];
      latestVersion.schemas = [...schemaIRIs];
      this.selfDescriptionStore.upsertMany([latestVersion]);
    });
  };

  private normalizeContents = (
    contentArray: SelfDescription[] | undefined,
    parentDTMI: string,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) =>
    forEach(contentArray, (c) =>
      this.normalizeContent(
        c,
        parentDTMI,
        parentInterface,
        contentIRIs,
        schemaIRIs
      )
    );

  private normalizeContent = (
    _content: SelfDescription,
    parentDTMI: string,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const content = ensureIDPresent(cloneDeep(_content), parentDTMI);

    switch (getDTDLType(content?.['@type'])) {
      case SelfDescriptionType.Property:
        this.processProperty(
          content as Property,
          parentInterface,
          contentIRIs,
          schemaIRIs
        );
        break;
      case SelfDescriptionType.Relationship:
        this.processRelationship(
          content as Relationship,
          parentInterface,
          contentIRIs,
          schemaIRIs
        );
        break;
      case SelfDescriptionType.Telemetry:
        this.processTelemetry(
          content as Telemetry,
          parentInterface,
          contentIRIs,
          schemaIRIs
        );
        break;
      case SelfDescriptionType.Component:
        this.processComponent(
          content as Component,
          parentInterface,
          contentIRIs,
          schemaIRIs
        );
        break;
      case SelfDescriptionType.Command:
        this.processCommand(
          content as Command,
          parentInterface,
          contentIRIs,
          schemaIRIs
        );
        break;
      default:
        throw new Error('Could not identify type');
    }
  };

  private processProperty = (
    value: Property,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const schemaIRI = this.processSchema(
      value?.schema,
      value?.['@id'],
      parentInterface,
      contentIRIs,
      schemaIRIs
    );
    value.schema = schemaIRI as any;
    this.selfDescriptionStore.upsertMany([value]);
    contentIRIs.push(value?.['@id']);
  };

  private processTelemetry = (
    value: Telemetry,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const schemaIRI = this.processSchema(
      value?.schema,
      value?.['@id'],
      parentInterface,
      contentIRIs,
      schemaIRIs
    );
    value.schema = schemaIRI as any;
    this.selfDescriptionStore.upsertMany([value]);
    contentIRIs.push(value?.['@id']);
  };

  private processRelationship = (
    value: Relationship,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const propertyIRIs = this.normalizeContents(
      value?.properties,
      value?.['@id'],
      parentInterface,
      contentIRIs,
      schemaIRIs
    );
    value.properties = (propertyIRIs || []) as any;
    this.selfDescriptionStore.upsertMany([value]);
    contentIRIs.push(value?.['@id']);
  };

  private processCommand = (
    value: Command,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const requestIRI = this.processCommandPayload(
      value?.request,
      value?.['@id'],
      parentInterface,
      contentIRIs,
      schemaIRIs
    );
    const responseIRI = this.processCommandPayload(
      value?.response,
      value?.['@id'],
      parentInterface,
      contentIRIs,
      schemaIRIs
    );

    value.request = requestIRI as any;
    value.response = responseIRI as any;

    this.selfDescriptionStore.upsertMany([value]);
    contentIRIs.push(value?.['@id']);
  };

  private processCommandPayload = (
    _value: CommandPayload,
    parentDTMI: string,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const content = ensureIDPresent(cloneDeep(_value), parentDTMI);
    const schemaIRI = this.processSchema(
      content?.schema,
      content?.['@id'],
      parentInterface,
      contentIRIs,
      schemaIRIs
    );
    content.schema = schemaIRI;
    this.selfDescriptionStore.upsertMany([content]);
    contentIRIs.push(content?.['@id']);
    return content?.['@id'];
  };

  private processComponent = (
    value: Component,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    if (isObject(value?.schema)) {
      const nestedInterface = ensureIDPresent(
        value?.schema as any,
        value?.['@id']
      );
      this.normalizeInterface(nestedInterface as Interface);
      value.schema = nestedInterface?.['@id'] as any;
    }
    this.selfDescriptionStore.upsertMany([value]);
    contentIRIs.push(value?.['@id']);
  };

  private processSchema = (
    _value: Schema,
    parentDTMI: string,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    if (isString(_value)) return _value;
    const value = ensureIDPresent(cloneDeep(_value), parentDTMI);

    switch (getDTDLType(value?.['@type'])) {
      case SelfDescriptionType.Enum:
        return this.processEnum(
          value as EnumSchema,
          parentInterface,
          contentIRIs,
          schemaIRIs
        );
      case SelfDescriptionType.Array:
        return this.processArray(
          value as ArraySchema,
          parentInterface,
          contentIRIs,
          schemaIRIs
        );
      case SelfDescriptionType.Object:
        return this.processObject(
          value as ObjectSchema,
          parentInterface,
          contentIRIs,
          schemaIRIs
        );
      case SelfDescriptionType.Map:
        return this.processMap(
          value as MapSchema,
          parentInterface,
          contentIRIs,
          schemaIRIs
        );
      default:
        throw new Error('Could not identify type');
    }
  };

  private processEnum = (
    value: EnumSchema,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    // also assign iris to enumvalues?
    schemaIRIs.push(value?.['@id']);
    this.add([value]);
    return value?.['@id'];
  };

  private processArray = (
    value: ArraySchema,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const schemaIRI = this.processSchema(
      value?.elementSchema,
      value?.['@id'],
      parentInterface,
      contentIRIs,
      schemaIRIs
    );
    value.elementSchema = schemaIRI as any;
    schemaIRIs.push(value?.['@id']);

    this.add([value]);
    return value?.['@id'];
  };

  private processMap = (
    value: MapSchema,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    // also process mapkey/mapvalue ?
    schemaIRIs.push(value?.['@id']);
    this.add([value]);

    return value?.['@id'];
  };

  private processObject = (
    value: ObjectSchema,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    // also process fields ?
    schemaIRIs.push(value?.['@id']);
    this.add([value]);
    return value?.['@id'];
  };

  private normalizeSchemas = (
    schemas: SelfDescription[] | undefined,
    parentInterface: Interface,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) =>
    forEach(schemas, (s) =>
      this.processSchema(
        s as Schema,
        parentInterface['@id'],
        parentInterface,
        contentIRIs,
        schemaIRIs
      )
    );
}
