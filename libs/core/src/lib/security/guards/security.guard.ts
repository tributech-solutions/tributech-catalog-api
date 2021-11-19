import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class SecurityGuard implements CanActivateChild, CanLoad {
  constructor(private authService: AuthService) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.canActivateProtectedRoutes$.pipe(
      distinctUntilChanged()
    );
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.authService.canActivateProtectedRoutes$.pipe(
      distinctUntilChanged()
    );
  }
}
