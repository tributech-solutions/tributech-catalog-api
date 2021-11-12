import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  clientId: 'catalog-ui',
  redirectUri: window?.location?.origin,
  responseType: 'code',
  scope:
    'openid profile roles catalog-api twin-api node-id offline_access email',
  sessionChecksEnabled: true,
  useSilentRefresh: false,
  oidc: true,
  customTokenParameters: ['realm_access'],
};
