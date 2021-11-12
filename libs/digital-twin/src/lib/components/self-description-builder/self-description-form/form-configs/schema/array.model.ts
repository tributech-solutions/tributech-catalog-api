import { DEFAULT_FIELDS, getSchemaProperty } from '../common.model';

export const DEFAULT_FIELDS_ARRAY = (
  items: { value: string; label: string }[]
) => [...DEFAULT_FIELDS, getSchemaProperty(items, 'elementSchema')];
