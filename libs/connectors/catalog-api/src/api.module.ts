import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CatalogApiConfiguration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { DtdlModelsService } from './api/dtdl-models.service';
import { ManageModelsService } from './api/manage-models.service';
import { ValidationService } from './api/validation.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class CatalogApiApiModule {
    public static forRoot(configurationFactory: () => CatalogApiConfiguration): ModuleWithProviders<CatalogApiApiModule> {
        return {
            ngModule: CatalogApiApiModule,
            providers: [ { provide: CatalogApiConfiguration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: CatalogApiApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('CatalogApiApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
