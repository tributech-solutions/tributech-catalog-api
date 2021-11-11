import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import to from 'await-to-js';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { without } from 'lodash';
import { SettingsModel } from '../config/settings.model';

interface TokenData {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: { roles: string[] };
  resource_access: { 'realm-management': { roles: string[] } };
  scope: string;
  'node-id': string;
  clientId: string;
  email_verified: boolean;
  clientHost: string;
  'node-name': string;
  preferred_username: string;
  clientAddress: string;
}

export class AuthenticationError extends Error {}

@Injectable()
export class AuthenticationService {
  private readonly authEnvironment: SettingsModel['ApiAuthOptions'];
  private readonly jwksClient: JwksClient;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {
    this.authEnvironment = this.configService.get<
      SettingsModel['ApiAuthOptions']
    >('ApiAuthOptions', {} as SettingsModel['ApiAuthOptions']);

    this.jwksClient = new JwksClient({
      jwksUri: this.authEnvironment.JwksCerts,
      timeout: 10000,
    });
  }

  async authenticate(accessToken: string) {
    return new Promise<{
      id: string;
      roles: string[];
    }>((resolve, reject) => {
      jwt.verify(
        accessToken,
        async (header, callback) => {
          const [error, key] = await to(
            this.jwksClient.getSigningKey(header.kid)
          );
          error || !key ? callback(error) : callback(null, key.getPublicKey());
        },
        {
          audience: this.authEnvironment.Audience,
          issuer: this.authEnvironment.Authority,
        },
        (err, decoded: TokenData) => {
          if (err) {
            reject(new AuthenticationError(err.message));
            return;
          }
          const presentScopes = decoded?.scope.split(' ');
          const requiredScopes = this.authEnvironment.Scopes;

          const missingScopes = without(requiredScopes, ...presentScopes);
          if (missingScopes.length !== 0) {
            const missingScopesStr = missingScopes.join(' ');
            reject(
              new AuthenticationError(`Missing scopes ` + missingScopesStr)
            );
            return;
          }

          resolve({
            id: decoded.sub,
            roles: decoded.realm_access.roles,
          });
        }
      );
    });
  }
}
