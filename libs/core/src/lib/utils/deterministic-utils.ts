import * as forge from 'node-forge';
import { GUID } from './guid.model';

export function getDeterministicGuid(...params: string[]): string {
  const sourceString = params.join('');
  const md = forge.md.sha1.create();
  md.update(sourceString);
  const bytes = md.digest().bytes(16);
  const byteArray = [
    bytes.charCodeAt(0),
    bytes.charCodeAt(1),
    bytes.charCodeAt(2),
    bytes.charCodeAt(3),
    bytes.charCodeAt(4),
    bytes.charCodeAt(5),
    bytes.charCodeAt(6),
    bytes.charCodeAt(7),
    bytes.charCodeAt(8),
    bytes.charCodeAt(9),
    bytes.charCodeAt(10),
    bytes.charCodeAt(11),
    bytes.charCodeAt(12),
    bytes.charCodeAt(13),
    bytes.charCodeAt(14),
    bytes.charCodeAt(15),
  ];
  return new GUID(byteArray).toString();
}
