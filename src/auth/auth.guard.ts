import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import to from 'await-to-js';
import { Request } from 'express';
import { AuthenticationService } from './auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const header = request.header('Authorization');
    if (!header) {
      throw new HttpException(
        'Authorization: Bearer <token> header missing',
        HttpStatus.UNAUTHORIZED
      );
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new HttpException(
        'Authorization: Bearer <token> header invalid',
        HttpStatus.UNAUTHORIZED
      );
    }

    const token = parts[1];

    const [error, success] = await to(
      this.authenticationService.authenticate(token)
    );

    if (error) {
      throw new HttpException(error?.message, HttpStatus.UNAUTHORIZED);
    }
    // Store the user on the request object if we want to retrieve it from the controllers
    request['user'] = success;
    return true;
  }
}
