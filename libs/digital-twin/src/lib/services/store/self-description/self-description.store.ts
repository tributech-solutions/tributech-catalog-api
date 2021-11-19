import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { SelfDescription } from '@tributech/self-description';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SelfDescriptionState
  extends EntityState<SelfDescription, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'SelfDescription', idKey: '@id' })
export class SelfDescriptionStore extends EntityStore<SelfDescriptionState> {
  constructor() {
    super();
  }
}
