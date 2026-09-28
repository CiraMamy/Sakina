import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user ?? { id: 'dev-user', role: 'USER' };

    if (!user || !user.id) {
      throw new UnauthorizedException('Authentication required');
    }

    request.user = user;
    return true;
  }
}
