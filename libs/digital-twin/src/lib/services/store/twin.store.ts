import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DigitalTwin } from '@tributech/twin-api';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TwinState extends EntityState<DigitalTwin, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'Twin', idKey: '$dtId', resettable: true })
export class TwinStore extends EntityStore<TwinState> {
  constructor() {
    super();
  }
}
