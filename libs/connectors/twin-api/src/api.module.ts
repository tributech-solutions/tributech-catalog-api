import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { TwinApiConfiguration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { GraphService } from './api/graph.service';
import { QueryService } from './api/query.service';
import { RelationshipsService } from './api/relationships.service';
import { TwinsService } from './api/twins.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class TwinApiApiModule {
    public static forRoot(configurationFactory: () => TwinApiConfiguration): ModuleWithProviders<TwinApiApiModule> {
        return {
            ngModule: TwinApiApiModule,
            providers: [ { provide: TwinApiConfiguration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: TwinApiApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('TwinApiApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
