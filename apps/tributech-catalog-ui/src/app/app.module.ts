import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormlyModule } from '@ngx-formly/core';
import { CatalogApiConfiguration } from '@tributech/catalog-api';
import {
  BUILDER_SETTINGS,
  RelationshipFormModule,
  SelfDescriptionBuilderModule,
  TrackByPropertyModule,
  TwinFormModule,
  TwinInstanceBuilderModule,
  TwinJsonModalModule,
  TwinTreeModule,
} from '@tributech/digital-twin';
import { TwinApiConfiguration } from '@tributech/twin-api';
import { OAuthModule } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authConfig } from './auth-config.base';
import { InstanceBuilderComponent } from './instance-builder/instance-builder.component';
import { InstanceOverviewModule } from './instance-overview/instance-overview.module';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { ModelBuilderComponent } from './model-builder/model-builder.component';
import { ModelOverviewModule } from './model-overview/model-overview.module';
import { SelfDescriptionGraphModule } from './self-description-graph/self-description-graph.module';
import { AuthInterceptor } from './shared/auth/auth.interceptor';
import { AuthService, BASE_AUTH_CONFIG } from './shared/auth/auth.service';
import { ConfigService } from './shared/config/config.service';
import { TwinBuilderToolbarModule } from './twin-builder-toolbar/twin-builder-toolbar.module';

export function configureApis(
  authService: AuthService,
  configService: ConfigService,
  catalogApi: CatalogApiConfiguration,
  twinApi: TwinApiConfiguration
) {
  return () => {
    configService.settingsObs$
      .pipe(filter((config) => !!config))
      .subscribe((config) => {
        catalogApi.basePath = config.endpoints.catalogApiUrl;
        catalogApi.accessToken = () => authService.getToken();

        twinApi.basePath = config.endpoints.twinApiUrl;
        twinApi.accessToken = () => authService.getToken();
      });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    InstanceBuilderComponent,
    MainSidebarComponent,
    ModelBuilderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormlyModule.forRoot(),
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    OAuthModule.forRoot(),
    TrackByPropertyModule,
    TwinBuilderToolbarModule,
    TwinTreeModule,
    TwinFormModule,
    RelationshipFormModule,
    MatDialogModule,
    MatSnackBarModule,
    AppRoutingModule,
    TwinInstanceBuilderModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    ModelOverviewModule,
    SelfDescriptionGraphModule,
    InstanceOverviewModule,
    TwinJsonModalModule,
    SelfDescriptionBuilderModule,
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: BUILDER_SETTINGS,
      useValue: {
        saveTwinsOnApply: true,
        loadTwinsFromServer: true,
      },
    },
    {
      provide: CatalogApiConfiguration,
      useValue: new CatalogApiConfiguration(),
    },
    { provide: TwinApiConfiguration, useValue: new TwinApiConfiguration() },
    {
      provide: APP_INITIALIZER,
      useFactory: configureApis,
      deps: [
        AuthService,
        ConfigService,
        CatalogApiConfiguration,
        TwinApiConfiguration,
      ],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: BASE_AUTH_CONFIG,
      useValue: authConfig,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.getConfig(),
      deps: [ConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
