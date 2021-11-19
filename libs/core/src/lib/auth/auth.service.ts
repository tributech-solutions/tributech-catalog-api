import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';

export const BASE_AUTH_CONFIG = new InjectionToken<ExtendedAuthConfig>(
  'BASE_AUTH_CONFIG'
);

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  email_verified: true;
  family_name: string;
  given_name: string;
  preferred_username: string;
  name: string;
  'node-id': string;
}

export interface ExtendedAuthConfig extends AuthConfig {
  canPostponeLogin: boolean;
}

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$,
  ]).pipe(map((values) => values.every((b) => b)));

  private isAdminSubject$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject$.asObservable();

  routerSub$: Subscription;
  storedUrl: string;

  get admin() {
    return this.isAdminSubject$.getValue();
  }

  get userId() {
    return this.userInfo?.sub;
  }

  get userInfo() {
    return this.oauthService.getIdentityClaims() as AccessTokenPayload;
  }

  constructor(
    private oauthService: OAuthService,
    private configService: ConfigService,
    private router: Router,
    @Inject(BASE_AUTH_CONFIG) private authConfig: ExtendedAuthConfig
  ) {
    this.configService.settingsObs$
      .pipe(debounceTime(100))
      .subscribe(async (config) => {
        const isAuthenticated = await this.configureAuthorizationAndTryLogin(
          `${config?.endpoints?.identityServerUrl}/${
            this.configService?.realmName || this.configService.nodeName
          }`
        );

        if (!isAuthenticated && !this.authConfig.canPostponeLogin) {
          this.login();
        } else {
          this.isAdminSubject$.next(
            this.hasAdminRole(this.getAccessTokenPayload())
          );
        }

        this.router.initialNavigation();
        this.routerSub$.unsubscribe();
        // navigate to url if user wanted to navigate to e.g. /audit-tool/292479...
        // but had to authenticate first
        if (this.storedUrl) {
          localStorage.removeItem('goToUrl');
          if (window.location.href === window.location.origin) {
            this.router.navigate([this.storedUrl]);
          }
          this.storedUrl = null;
        }
      });

    // logic for storing URLs so the app can navigate to
    // them after authentication
    this.routerSub$ = this.router.events
      .pipe(
        filter((el: RouterEvent) => el instanceof NavigationStart),
        untilDestroyed(this)
      )
      .subscribe((el: NavigationStart) => {
        const url = el.url.slice(1, el.url.length);
        this.storedUrl = localStorage.getItem('goToUrl');
        if (!this.storedUrl && url) {
          localStorage.setItem('goToUrl', url);
        }
      });

    this.oauthService.events.pipe(untilDestroyed(this)).subscribe(() => {
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });

    this.oauthService.events
      .pipe(
        filter((e) => e.type === 'session_terminated'),
        debounceTime(100)
      )
      .subscribe((e) => {
        console.warn('Your session has been terminated!');
        localStorage.setItem('goToUrl', window?.location?.pathname);
        this.logout();
      });

    this.oauthService.events
      .pipe(
        filter((e) => ['token_received'].includes(e.type)),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.oauthService.loadUserProfile();
      });
  }

  ngOnDestroy(): void {
    this.isAuthenticatedSubject$.complete();
    this.isDoneLoadingSubject$.complete();
  }

  /**
   * We manually clear all tokens, stop automatic refreshes
   * and call the logout endpoint
   *
   * The library we use seems to cancel the logout request, that is why
   * everything is done manually.
   */
  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('nonce');
    sessionStorage.removeItem('PKCE_verifier');
    sessionStorage.removeItem('expires_at');
    sessionStorage.removeItem('id_token_claims_obj');
    sessionStorage.removeItem('id_token_expires_at');
    sessionStorage.removeItem('id_token_stored_at');
    sessionStorage.removeItem('access_token_stored_at');
    sessionStorage.removeItem('granted_scopes');
    sessionStorage.removeItem('session_state');

    this.oauthService.stopAutomaticRefresh();
    const redirectUri = window?.location?.origin;
    // // eslint-disable-next-line max-len
    window.location.href =
      `${this.configService?.endpoints?.identityServerUrl}/` +
      `${
        this.configService.realmName || this.configService.nodeName
      }/protocol/openid-connect/logout?redirect_uri=${redirectUri}`;
  }

  login(): void {
    this.oauthService.initLoginFlow();
  }

  tryLogin() {
    return this.configureAuthorizationAndTryLogin();
  }

  getToken(): string {
    return this.oauthService.getAccessToken();
  }

  getIdToken(): string {
    return this.oauthService.getIdToken();
  }

  configureAuthorizationAndTryLogin(_identityServerUrl?: string) {
    const identityServerUrl =
      _identityServerUrl || localStorage.getItem('identityServerUrl');

    this.oauthService.configure(this.buildAuthConfig(identityServerUrl));
    return this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then((loggedIn) => {
        this.oauthService.setupAutomaticSilentRefresh();
        this.isDoneLoadingSubject$.next(true);
        return loggedIn;
      });
  }

  private buildAuthConfig(identityServerUrl: string): AuthConfig {
    localStorage.setItem('identityServerUrl', identityServerUrl);
    return { ...this.authConfig, issuer: identityServerUrl };
  }

  private getAccessTokenPayload() {
    const accessToken = this.getToken();
    if (!accessToken) return null;
    const [header, payload, ...sig] = accessToken.split('.');
    return JSON.parse(atob(payload));
  }

  private hasAdminRole(payload: any) {
    return payload?.realm_access?.roles?.includes?.(UserRole.ADMIN) ?? false;
  }
}
