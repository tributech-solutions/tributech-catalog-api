import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Endpoints {
  identityServerUrl: string;
  keycloakApiUrl: string;
  documentationUrl: string;
  supportCenterUrl: string;
  catalogApiUrl: string;
  twinApiUrl: string;
}

export interface AuthorizationConfig {
  tributech_dsk_node_id: string;
}

export interface NotificationApiSettings {
  activated: boolean;
}

export interface SyncStateSettings {
  activated: boolean;
}

export interface TraceToolAgentMockData {
  activated: boolean;
}

export interface ApiKeySecrets {
  clientId: string;
  clientSecret: string;
}

export interface MTCHeader {
  text: string;
  iconPath: string;
  backgroundColor: string;
}

export interface TrialMode {
  enabled: boolean;
}
export interface Config {
  endpoints: Endpoints;
  authorizationConfig?: AuthorizationConfig;
  notificationApiSettings?: NotificationApiSettings;
  syncStateSettings?: SyncStateSettings;
  traceToolAgentMockData?: TraceToolAgentMockData;
  mtcHeader?: MTCHeader;
  trialMode?: TrialMode;
  hubName?: string;
  realm?: { name: string };
}

export const TRIAL_MODE: InjectionToken<boolean> = new InjectionToken<boolean>(
  'Is trial mode active?',
  {
    providedIn: 'root',
    factory: () => {
      const configService: ConfigService = inject(ConfigService);
      return configService?.trialMode?.enabled;
    },
  }
);

export const MTC_ACTIVE: InjectionToken<boolean> = new InjectionToken<boolean>(
  'Is mtc active?',
  {
    providedIn: 'root',
    factory: () => {
      const configService: ConfigService = inject(ConfigService);
      return !!configService?.mtcHeader?.text ?? false;
    },
  }
);

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private settingsSubject: BehaviorSubject<Config> = new BehaviorSubject(null);
  settingsObs$: Observable<Config> = this.settingsSubject
    .asObservable()
    .pipe(filter((config) => !!config));

  nodeName: string;
  hubName: string;
  realmName: string;

  currentNodeId: string;

  endpoints: Endpoints;
  authorizationConfig: AuthorizationConfig;
  notificationApiSettings: NotificationApiSettings;
  syncStateSettings: SyncStateSettings;
  traceToolAgentMockData: TraceToolAgentMockData;
  mtcHeader: MTCHeader;
  trialMode: TrialMode;

  constructor(private http: HttpClient) {}

  setBaseUrls(nodeName?: string, hubName?: string) {
    this.nodeName = nodeName || localStorage.getItem('dataspace-node');
    this.hubName = hubName || localStorage.getItem('dataspace-hub');
    if (!this.nodeName || !this.hubName) return;
    this.parseConfigData(
      this.buildConfigFromBaseUrls(this.nodeName, this.hubName)
    );
  }

  private getJSON(): Promise<Config> {
    return this.http.get<Config>('./assets/config/config.json').toPromise();
  }

  async getConfig(): Promise<void> {
    return this.getJSON()
      .then((config: Config) => this.parseConfigData(config))
      .catch((reason: string) => {
        console.log(
          'Could not find a config.json file in your assets folder. Please provide one.'
        );
        console.log(reason);
      });
  }

  /**
   * The agent-companion can be dynamically connected to an ecosystem, therefore we can not load an
   * hardcoded configuration. Instead we offer the possibility to build the paths from scratch based
   * on the hub and node names.
   */
  private buildConfigFromBaseUrls(nodeName: string, hubName: string): Config {
    localStorage.setItem('dataspace-node', nodeName);
    localStorage.setItem('dataspace-hub', hubName);
    const endpoints: Endpoints = {
      identityServerUrl: `https://auth.${hubName}.dataspace-hub.com/auth/realms`,
      keycloakApiUrl: `https://auth.${hubName}.dataspace-hub.com/auth/admin/realms`,
      documentationUrl: `https://docs.tributech.io`,
      supportCenterUrl: `https://tributech.atlassian.net/servicedesk/customer/portals`,
      catalogApiUrl: `https://catalog-api.${nodeName}.dataspace-node.com`,
      twinApiUrl: `https://twin-api.${nodeName}.dataspace-node.com`,
    };

    this.realmName = nodeName;

    return { endpoints };
  }

  private parseConfigData(config: Config) {
    this.endpoints = config.endpoints;
    this.authorizationConfig = config.authorizationConfig;
    this.notificationApiSettings = config.notificationApiSettings;
    this.traceToolAgentMockData = config.traceToolAgentMockData;
    this.syncStateSettings = config.syncStateSettings;
    this.mtcHeader = config.mtcHeader;
    this.trialMode = config.trialMode;
    this.realmName = config.realm?.name;
    this.settingsSubject.next(config);
  }
}
