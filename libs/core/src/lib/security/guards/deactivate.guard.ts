import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface DeactivationGuarded {
  canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({ providedIn: 'root' })
export class CanDeactivateGuard implements CanDeactivate<DeactivationGuarded> {
  canDeactivate(
    component: DeactivationGuarded
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canExit();
  }
}
