import { isArray } from 'lodash';
import { SelfDescriptionType } from '../models/constants';
import { Interface, InterfaceContent, Property } from '../models/models';

// see https://github.com/Azure/digital-twin-model-identifier#validation-regular-expressions
export const DTMI_REGEX =
  '^dtmi:(?:_+[A-Za-z0-9]|[A-Za-z])(?:[A-Za-z0-9_]*[A-Za-z0-9])?(?::(?:_+[A-Za-z0-9]|[A-Za-z])(?:[A-Za-z0-9_]*[A-Za-z0-9])?)*;[1-9][0-9]{0,8}$';

export function isValidInterface(model: Interface): boolean {
  if (!isValidDTMI(model?.['@id'])) {
    throw new Error('Invalid DTMI');
  }
  if (!isInterfaceType(model)) {
    throw new Error('Model is not of type interface');
  }
  if (!isDTMLContext(model?.['@context'])) {
    throw new Error('Missing dtmi context!');
  }

  return true;
}

export function isValidDTMI(dtmi: string | undefined): boolean {
  if (!dtmi) return false;
  const regex = new RegExp(DTMI_REGEX);
  return regex.test(dtmi);
}

export function isInterfaceType(model: Interface): boolean {
  return model?.['@type']?.includes(SelfDescriptionType.Interface) ?? false;
}

export function isDTMLContext(context: string): boolean {
  return context === 'dtmi:dtdl:context;2';
}

export function isProperty(content: InterfaceContent): content is Property {
  const type = content?.['@type'];
  return !isArray(type)
    ? type === SelfDescriptionType.Property
    : (type as string[])?.includes(SelfDescriptionType.Property);
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
