import { SelfDescriptionType } from './constants';
import { SemanticType } from './semantic-type';

export interface SelfDescription {
  '@id'?: string;
  '@type'?:
    | SelfDescriptionType
    | [SelfDescriptionType, SemanticType]
    | [SemanticType, SelfDescriptionType];
  comment?: string;
  description?: string;
  displayName?: string;

  [key: string]: any;
}

export type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined;
};
