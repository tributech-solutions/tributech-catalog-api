import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TwinInstance } from '@tributech/self-description';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TwinState extends EntityState<TwinInstance, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'Twin', idKey: '$dtId', resettable: true })
export class TwinStore extends EntityStore<TwinState> {
  constructor() {
    super();
  }
}
