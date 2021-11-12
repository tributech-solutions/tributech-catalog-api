import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    if (
      request.url.includes('dataspace-hub.com') ||
      request.url.includes('dataspace-node.com')
    ) {
      let requestToForward: HttpRequest<T>;

      const token = this.authService.getToken();

      if (token) {
        const tokenValue = 'Bearer ' + token;
        requestToForward = request.clone({
          setHeaders: { Authorization: tokenValue },
        });
      }

      if (!requestToForward) {
        requestToForward = request.clone();
      }

      const obs = next.handle(requestToForward).pipe(
        tap((res: HttpEvent<T>) => {
          const castedResponse = res as HttpResponse<{
            errors?: { extensions: { code: string } }[];
          }>;
          if (
            castedResponse?.body?.errors?.[0]?.extensions?.code !==
            'authorization'
          ) {
            return;
          }
          console.log('User not authorized');
        })
      );

      return obs;
    } else {
      return next.handle(request);
    }
  }
}
