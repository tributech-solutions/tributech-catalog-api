import { Injectable } from '@angular/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TwinInstanceBuilderQuery {
  dtmi$: Observable<string> = this.routerQuery.selectQueryParams('dtmi');
  dtId$: Observable<string> = this.routerQuery.selectQueryParams('dtid');

  constructor(private routerQuery: RouterQuery) {}
}
