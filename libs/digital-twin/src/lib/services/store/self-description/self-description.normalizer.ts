import { getContentType, SelfDescription } from '@tributech/self-description';

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

export function ensureIDPresent(
  value: SelfDescription,
  parentDTMI: string,
  skipTypeName: boolean = false,
  skipName: boolean = false
): SelfDescription {
  if (value?.['@id']) return value;

  const prefix = getDTMIPrefix(parentDTMI);
  const targetVersion = getDTMIVersion(parentDTMI);
  const id: string[] = [];

  id.push(prefix);

  if (!skipTypeName) {
    const contentType = getContentType(value?.['@type'])?.toLowerCase();
    if (contentType) {
      id.push(contentType);
    }
  }

  if (!skipName) {
    const contentName = value.name?.toLowerCase();
    if (contentName) {
      id.push(contentName);
    }
  }

  value['@id'] = `${id.join(':')};${targetVersion}`;

  return value;
}

export function getDTMIPrefix(dtmi: string) {
  return dtmi.substr(0, dtmi.lastIndexOf(';'));
}

export function getDTMIVersion(dtmi: string) {
  return parseInt(dtmi.substr(dtmi.lastIndexOf(';') + 1), 10);
}
