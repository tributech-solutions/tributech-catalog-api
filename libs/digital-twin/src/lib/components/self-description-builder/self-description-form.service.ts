import { Injectable } from '@angular/core';
import {
  SelfDescription,
  SelfDescriptionType,
} from '@tributech/self-description';
import { SelfDescriptionQuery } from '../../services/store/self-description/self-description.query';
import { DEFAULT_FIELDS_COMMAND } from './self-description-form/form-configs/command.model';
import { DEFAULT_FIELDS } from './self-description-form/form-configs/common.model';
import { DEFAULT_FIELDS_COMPONENT } from './self-description-form/form-configs/component.model';
import { DEFAULT_FIELDS_INTERFACE } from './self-description-form/form-configs/interface.model';
import { DEFAULT_FIELDS_PROPERTY } from './self-description-form/form-configs/property.model';
import { DEFAULT_FIELDS_RELATIONSHIP } from './self-description-form/form-configs/relationship.model';
import { DEFAULT_FIELDS_ARRAY } from './self-description-form/form-configs/schema/array.model';
import { DEFAULT_FIELDS_ENUM } from './self-description-form/form-configs/schema/enum.model';
import { DEFAULT_FIELDS_MAP } from './self-description-form/form-configs/schema/map.model';
import { DEFAULT_FIELDS_OBJECT } from './self-description-form/form-configs/schema/object.model';
import { DEFAULT_FIELDS_TELEMETRY } from './self-description-form/form-configs/telemetry.model';

@Injectable({
  providedIn: 'root',
})
export class SelfDescriptionFormService {
  mapToSelectOption = (item: string) => ({ label: item, value: item });

  constructor(private selfDescriptionQuery: SelfDescriptionQuery) {}

  getFormConfigForSelfDescription(selfDescription: SelfDescription) {
    switch (selfDescription?.['@type']) {
      case SelfDescriptionType.Interface:
        return DEFAULT_FIELDS_INTERFACE(
          this.selfDescriptionQuery
            .getInterfaceIRIs()
            .map(this.mapToSelectOption)
        );
      case SelfDescriptionType.Property:
        return DEFAULT_FIELDS_PROPERTY(
          this.selfDescriptionQuery.getSchemaIRIs().map(this.mapToSelectOption)
        );
      case SelfDescriptionType.Relationship:
        return DEFAULT_FIELDS_RELATIONSHIP(
          this.selfDescriptionQuery
            .getInterfaceIRIs()
            .map(this.mapToSelectOption)
        );
      case SelfDescriptionType.Telemetry:
        return DEFAULT_FIELDS_TELEMETRY(
          this.selfDescriptionQuery.getSchemaIRIs().map(this.mapToSelectOption)
        );
      case SelfDescriptionType.Component:
        return DEFAULT_FIELDS_COMPONENT(
          this.selfDescriptionQuery
            .getInterfaceIRIs()
            .map(this.mapToSelectOption)
        );
      case SelfDescriptionType.Command:
        return DEFAULT_FIELDS_COMMAND;
      case SelfDescriptionType.Map:
        return DEFAULT_FIELDS_MAP(
          this.selfDescriptionQuery.getSchemaIRIs().map(this.mapToSelectOption)
        );
      case SelfDescriptionType.Enum:
        return DEFAULT_FIELDS_ENUM;
      case SelfDescriptionType.Object:
        return DEFAULT_FIELDS_OBJECT;
      case SelfDescriptionType.Array:
        return DEFAULT_FIELDS_ARRAY(
          this.selfDescriptionQuery.getSchemaIRIs().map(this.mapToSelectOption)
        );

      default:
        return DEFAULT_FIELDS;
    }
  }

  createEmptySelfDescription(type: SelfDescriptionType) {
    return { '@type': type };
  }
}
