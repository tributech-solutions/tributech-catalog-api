import { isArray } from '@datorama/akita';

export function getInPath(object: any, path: string | string[]) {
  if (!object) return undefined;
  if (!path) return object;

  const parts = isArray(path) ? path : path?.split?.('.');
  return parts?.reduce((acc, part) => acc && acc[part], object) ?? undefined;
}
