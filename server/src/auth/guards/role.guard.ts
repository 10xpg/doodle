import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { REQ_USER_KEY } from 'src/common/constants';
import { AccessJwtContract } from 'src/common/types';

@Injectable()
export class BrokenAccessControlGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesList = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const request: Request = context.switchToHttp().getRequest();
    const user: AccessJwtContract = request[REQ_USER_KEY];

    if (user.role === 'ADMIN' && rolesList.includes(user.role)) return true;

    if (
      user.role === 'CUSTOMER' &&
      rolesList.includes(user.role) &&
      user.sub === request.params.id
    )
      return true;

    throw new ForbiddenException('Permission Denied');
  }
}
