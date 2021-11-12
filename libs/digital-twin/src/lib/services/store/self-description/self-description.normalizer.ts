import ShortUniqueId from 'short-unique-id';
import { getContentType, SelfDescription } from '../../../models/data.model';

export function generateDTMI(
  value: SelfDescription,
  parent: SelfDescription
): string {
  if (value?.['@id']) return value?.['@id'];
  const parentIdentifier = parent['@id'].replace(';1', '');
  const contentType = getContentType(value?.['@type'])?.toLowerCase();
  const contentName = value.name;
  return `${parentIdentifier}:${contentType?.toLowerCase()}:${contentName?.toLowerCase()};1`;
}

const shortUniqueId = new ShortUniqueId({ length: 6 });

export function ensureIDPresent(
  value: SelfDescription,
  parentDTMI: string
): SelfDescription {
  if (value?.['@id']) return value;
  const prefix = getDTMIPrefix(parentDTMI);
  const targetVersion = getDTMIVersion(parentDTMI);
  const contentType = getContentType(value?.['@type'])?.toLowerCase();
  const contentName = value.name?.toLowerCase() || shortUniqueId();
  const id = `${prefix}:${contentType}:${contentName};${targetVersion}`;
  value['@id'] = id;
  return value;
}

export function getDTMIPrefix(dtmi: string) {
  return dtmi.substr(0, dtmi.lastIndexOf(';'));
}
export function getDTMIVersion(dtmi: string) {
  return parseInt(dtmi.substr(dtmi.lastIndexOf(';') + 1), 10);
}
