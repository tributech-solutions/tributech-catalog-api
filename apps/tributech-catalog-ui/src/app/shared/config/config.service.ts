import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

export interface Config {
  endpoints: Endpoints;
  authorizationConfig?: AuthorizationConfig;
  hubName?: string;
  realm?: { name: string };
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private settingsSubject: BehaviorSubject<Config> = new BehaviorSubject(null);
  settingsObs$: Observable<Config> = this.settingsSubject
    .asObservable()
    .pipe(filter((config) => !!config));

  nodeName: string;
  realmName: string;
  currentNodeId: string;
  endpoints: Endpoints;
  authorizationConfig: AuthorizationConfig;

  constructor(private http: HttpClient) {}

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

  private parseConfigData(config: Config) {
    this.endpoints = config.endpoints;
    this.authorizationConfig = config.authorizationConfig;

    this.realmName = config.realm?.name;
    this.settingsSubject.next(config);
  }
}
