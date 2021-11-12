import { InjectionToken } from '@angular/core';

export const OFFLINE_MODE: InjectionToken<boolean> =
  new InjectionToken<boolean>('Should changes be synced to the server?');
