import { InjectionToken } from '@angular/core';

export interface TwinBuilderSettings {
  saveTwinsOnApply: boolean;
  loadTwinsFromServer: boolean;
}

export const BUILDER_SETTINGS: InjectionToken<TwinBuilderSettings> =
  new InjectionToken<TwinBuilderSettings>('Settings for twin builder');
