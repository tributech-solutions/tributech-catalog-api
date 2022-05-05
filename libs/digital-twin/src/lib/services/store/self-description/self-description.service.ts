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
  EnumValue,
  Field,
  getDTDLType,
  Interface,
  isInterfaceSD,
  MapKey,
  MapSchema,
  MapValue,
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
      this.normalizeContents(contents, sd['@id'], contentIRIs, schemaIRIs);
      this.normalizeSchemas(schemas, sd['@id'], contentIRIs, schemaIRIs);

      const latestVersion: any = sd as any;

      latestVersion.contents = [...contentIRIs];
      latestVersion.schemas = [...schemaIRIs];
      this.selfDescriptionStore.upsertMany([latestVersion]);
    });
  };

  private normalizeContents = (
    contentArray: SelfDescription[] | undefined,
    parentDTMI: string,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) =>
    forEach(contentArray, (c) =>
      this.normalizeContent(c, parentDTMI, contentIRIs, schemaIRIs)
    );

  private normalizeContent = (
    _content: SelfDescription,
    parentDTMI: string,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const content = ensureIDPresent(cloneDeep(_content), parentDTMI);

    switch (getDTDLType(content?.['@type'])) {
      case SelfDescriptionType.Property:
        this.processProperty(content as Property, contentIRIs, schemaIRIs);
        break;
      case SelfDescriptionType.Relationship:
        this.processRelationship(
          content as Relationship,
          contentIRIs,
          schemaIRIs
        );
        break;
      case SelfDescriptionType.Telemetry:
        this.processTelemetry(content as Telemetry, contentIRIs, schemaIRIs);
        break;
      case SelfDescriptionType.Component:
        this.processComponent(content as Component, contentIRIs, schemaIRIs);
        break;
      case SelfDescriptionType.Command:
        this.processCommand(content as Command, contentIRIs, schemaIRIs);
        break;
      default:
        throw new Error('Could not identify type');
    }
  };

  private processProperty = (
    value: Property,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const schemaIRI = this.processSchema(
      value?.schema,
      value?.['@id'],
      contentIRIs,
      schemaIRIs
    );
    value.schema = schemaIRI as any;
    this.selfDescriptionStore.upsertMany([value]);
    contentIRIs.push(value?.['@id']);
  };

  private processTelemetry = (
    value: Telemetry,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const schemaIRI = this.processSchema(
      value?.schema,
      value?.['@id'],
      contentIRIs,
      schemaIRIs
    );
    value.schema = schemaIRI as any;
    this.selfDescriptionStore.upsertMany([value]);
    contentIRIs.push(value?.['@id']);
  };

  private processRelationship = (
    value: Relationship,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const propertyIRIs = this.normalizeContents(
      value?.properties,
      value?.['@id'],
      contentIRIs,
      schemaIRIs
    );
    value.properties = (propertyIRIs || []) as any;
    this.selfDescriptionStore.upsertMany([value]);
    contentIRIs.push(value?.['@id']);
  };

  private processCommand = (
    value: Command,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const requestIRI = this.processCommandPayload(
      value?.request,
      value?.['@id'],
      contentIRIs,
      schemaIRIs
    );
    const responseIRI = this.processCommandPayload(
      value?.response,
      value?.['@id'],
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
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const content = ensureIDPresent(cloneDeep(_value), parentDTMI);
    const schemaIRI = this.processSchema(
      content?.schema,
      content?.['@id'],
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
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    if (isString(_value)) return _value;
    const value = ensureIDPresent(cloneDeep(_value), parentDTMI);

    switch (getDTDLType(value?.['@type'])) {
      case SelfDescriptionType.Enum:
        return this.processEnum(value as EnumSchema, contentIRIs, schemaIRIs);
      case SelfDescriptionType.Array:
        return this.processArray(value as ArraySchema, contentIRIs, schemaIRIs);
      case SelfDescriptionType.Object:
        return this.processObject(
          value as ObjectSchema,
          contentIRIs,
          schemaIRIs
        );
      case SelfDescriptionType.Map:
        return this.processMap(value as MapSchema, contentIRIs, schemaIRIs);
      default:
        throw new Error('Could not identify type');
    }
  };

  private processEnum = (
    value: EnumSchema,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const enumValueIRIs = value.enumValues.map((val) =>
      this.processEnumValue(val, value?.['@id'])
    );

    schemaIRIs.push(value?.['@id']);
    value.enumValues = enumValueIRIs as any;
    this.add([value]);
    return value?.['@id'];
  };

  private processEnumValue = (_value: EnumValue, parentDTMI: string) => {
    return ensureIDPresent(cloneDeep(_value), parentDTMI, true);
  };

  private processArray = (
    value: ArraySchema,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const schemaIRI = this.processSchema(
      value?.elementSchema,
      value?.['@id'],
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
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const mapKey = this.processMapKeyValue(
      value?.mapKey,
      value?.['@id'],
      contentIRIs,
      schemaIRIs
    );
    const mapValue = this.processMapKeyValue(
      value?.mapValue,
      value?.['@id'],
      contentIRIs,
      schemaIRIs
    );

    schemaIRIs.push(value?.['@id']);

    value.mapKey = mapKey as any;
    value.mapValue = mapValue as any;

    this.add([value]);

    return value?.['@id'];
  };

  private processMapKeyValue = (
    _value: MapKey | MapValue,
    parentDTMI: string,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const content = ensureIDPresent(cloneDeep(_value), parentDTMI, true);
    const schemaIRI = this.processSchema(
      content?.schema,
      content?.['@id'],
      contentIRIs,
      schemaIRIs
    );
    content.schema = schemaIRI;

    if (schemaIRIs.includes('dtmi')) {
      schemaIRIs.push(schemaIRI);
    }
    return content;
  };

  private processObject = (
    value: ObjectSchema,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const fieldIRIs = value?.fields?.map((field) =>
      this.processField(field, value?.['@id'], contentIRIs, schemaIRIs)
    );
    schemaIRIs.push(value?.['@id']);
    value.fields = fieldIRIs as any;
    this.add([value]);
    return value?.['@id'];
  };

  private processField = (
    _value: Field,
    parentDTMI: string,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) => {
    const content = ensureIDPresent(cloneDeep(_value), parentDTMI, true);

    const schemaIRI = this.processSchema(
      content?.schema,
      content?.['@id'],
      contentIRIs,
      schemaIRIs
    );
    content.schema = schemaIRI;

    if (schemaIRIs.includes('dtmi')) {
      schemaIRIs.push(schemaIRI);
    }
    return content;
  };

  private normalizeSchemas = (
    schemas: SelfDescription[] | undefined,
    parentDTMI: string,
    contentIRIs: string[],
    schemaIRIs: string[]
  ) =>
    forEach(schemas, (s) =>
      this.processSchema(s as Schema, parentDTMI, contentIRIs, schemaIRIs)
    );
}
