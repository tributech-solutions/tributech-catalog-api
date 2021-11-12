import { Injectable } from '@angular/core';
import { arrayAdd, isObject, isString, OrArray } from '@datorama/akita';
import { cloneDeep, map } from 'lodash';
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
} from '../../../models/data.model';
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
    const contentIRIs = this.normalizeContents(contents, sd['@id'], sd);
    const schemaIRIs = this.normalizeSchemas(schemas, sd);

    // we need to fetch the latest version from db again otherwise we will override children
    const latestVersion =
      cloneDeep(this.selfDescriptionQuery.getEntity(sd?.['@id'])) || sd;
    latestVersion.contents = [
      ...(latestVersion?.contents ?? []),
      ...contentIRIs,
    ];
    latestVersion.schemas = [...(latestVersion?.schemas ?? []), ...schemaIRIs];
    this.selfDescriptionStore.upsertMany([latestVersion]);
  };

  private normalizeContents = (
    contentArray: SelfDescription[] | undefined,
    parentDTMI: string,
    parentInterface: Interface
  ) =>
    map(contentArray, (c) =>
      this.normalizeContent(c, parentDTMI, parentInterface)
    );

  private normalizeContent = (
    _content: SelfDescription,
    parentDTMI: string,
    parentInterface: Interface
  ) => {
    const content = ensureIDPresent(cloneDeep(_content), parentDTMI);

    switch (getDTDLType(content?.['@type'])) {
      case SelfDescriptionType.Property:
        return this.processProperty(content as Property, parentInterface);
      case SelfDescriptionType.Relationship:
        return this.processRelationship(
          content as Relationship,
          parentInterface
        );
      case SelfDescriptionType.Telemetry:
        return this.processTelemetry(content as Telemetry, parentInterface);
      case SelfDescriptionType.Component:
        return this.processComponent(content as Component, parentInterface);
      case SelfDescriptionType.Command:
        return this.processCommand(content as Command, parentInterface);
      default:
        throw new Error('Could not identify type');
    }
  };

  private processProperty = (value: Property, parentInterface: Interface) => {
    const schemaIRI = this.processSchema(
      value?.schema,
      value?.['@id'],
      parentInterface
    );
    value.schema = schemaIRI as any;
    this.selfDescriptionStore.upsertMany([value]);
    return value?.['@id'];
  };

  private processTelemetry = (value: Telemetry, parentInterface: Interface) => {
    const schemaIRI = this.processSchema(
      value?.schema,
      value?.['@id'],
      parentInterface
    );
    value.schema = schemaIRI as any;
    this.selfDescriptionStore.upsertMany([value]);
    return value?.['@id'];
  };

  private processRelationship = (
    value: Relationship,
    parentInterface: Interface
  ) => {
    const propertyIRIs = this.normalizeContents(
      value?.properties,
      value?.['@id'],
      parentInterface
    );
    value.properties = (propertyIRIs || []) as any;
    this.selfDescriptionStore.upsertMany([value]);
    return value?.['@id'];
  };

  private processCommand = (value: Command, parentInterface: Interface) => {
    const requestIRI = this.processCommandPayload(
      value?.request,
      value?.['@id'],
      parentInterface
    );
    const responseIRI = this.processCommandPayload(
      value?.response,
      value?.['@id'],
      parentInterface
    );

    value.request = requestIRI as any;
    value.response = responseIRI as any;

    this.selfDescriptionStore.upsertMany([value]);
    return value?.['@id'];
  };

  private processCommandPayload = (
    _value: CommandPayload,
    parentDTMI: string,
    parentInterface: Interface
  ) => {
    const content = ensureIDPresent(cloneDeep(_value), parentDTMI);
    const schemaIRI = this.processSchema(
      content?.schema,
      content?.['@id'],
      parentInterface
    );
    content.schema = schemaIRI;
    this.selfDescriptionStore.upsertMany([content]);
    return content?.['@id'];
  };

  private processComponent = (value: Component, parentInterface: Interface) => {
    if (isObject(value?.schema)) {
      const nestedInterface = ensureIDPresent(value?.schema, value?.['@id']);
      this.normalizeInterface(nestedInterface as Interface);
      value.schema = nestedInterface?.['@id'] as any;
    }
    this.selfDescriptionStore.upsertMany([value]);
    return value?.['@id'];
  };

  private processSchema = (
    _value: Schema,
    parentDTMI: string,
    parentInterface: Interface
  ) => {
    if (isString(_value)) return _value;
    const value = ensureIDPresent(cloneDeep(_value), parentDTMI);

    switch (getDTDLType(value?.['@type'])) {
      case SelfDescriptionType.Enum:
        return this.processEnum(value as EnumSchema, parentInterface);
      case SelfDescriptionType.Array:
        return this.processArray(value as ArraySchema, parentInterface);
      case SelfDescriptionType.Object:
        return this.processObject(value as ObjectSchema, parentInterface);
      case SelfDescriptionType.Map:
        return this.processMap(value as MapSchema, parentInterface);
      default:
        throw new Error('Could not identify type');
    }
  };

  private processEnum = (value: EnumSchema, parentInterface: Interface) => {
    // also assign iris to enumvalues?
    this.addAndLink(parentInterface, value, ChildLinkTarget.SCHEMAS);
    return value?.['@id'];
  };

  private processArray = (value: ArraySchema, parentInterface: Interface) => {
    const schemaIRI = this.processSchema(
      value?.elementSchema,
      value?.['@id'],
      parentInterface
    );
    value.elementSchema = schemaIRI as any;
    this.addAndLink(parentInterface, value, ChildLinkTarget.SCHEMAS);
    return value?.['@id'];
  };

  private processMap = (value: MapSchema, parentInterface: Interface) => {
    // also process mapkey/mapvalue ?
    this.addAndLink(parentInterface, value, ChildLinkTarget.SCHEMAS);
    return value?.['@id'];
  };

  private processObject = (value: ObjectSchema, parentInterface: Interface) => {
    // also process fields ?
    this.addAndLink(parentInterface, value, ChildLinkTarget.SCHEMAS);
    return value?.['@id'];
  };

  private normalizeSchemas = (
    schemas: SelfDescription[] | undefined,
    parentInterface: Interface
  ) =>
    map(schemas, (s) =>
      this.processSchema(s as Schema, parentInterface['@id'], parentInterface)
    );
}
