import { isArray } from 'lodash';
import { Interface, InterfaceContent, Property } from '../models/models';
import { ValidationError } from '../models/validation-error.model';

export function isValidInterface(model: Interface): boolean {
  if (!isValidDTMI(model?.['@id'])) {
    throw new ValidationError('Invalid DTMI');
  }
  if (!isInterfaceType(model)) {
    throw new ValidationError('Model is not of type interface');
  }
  if (!isDTMLContext(model?.['@context'])) {
    throw new ValidationError('Missing dtmi context!');
  }

  return true;
}

export function isValidDTMI(dtmi: string): boolean {
  const regex = new RegExp(
    '^dtmi:(?:_+[A-Za-z0-9]|[A-Za-z])(?:[A-Za-z0-9_]*[A-Za-z0-9])?(?::(?:_+[A-Za-z0-9]|[A-Za-z])(?:[A-Za-z0-9_]*[A-Za-z0-9])?)*;[1-9][0-9]{0,8}$'
  );
  return regex.test(dtmi);
}

export function isInterfaceType(model: Interface): boolean {
  return model?.['@type'] === 'Interface';
}

export function isDTMLContext(context: string): boolean {
  return context === 'dtmi:dtdl:context;2';
}

export function isProperty(content: InterfaceContent): content is Property {
  const type = content?.['@type'];
  return !isArray(type) ? type === 'Property' : type?.includes('Property');
}
