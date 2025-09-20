import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { REQ_USER_KEY } from 'src/common/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const rolesList = this.reflector.get<string>('roles', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();
    const uRole = request[REQ_USER_KEY].role;
    if (rolesList.includes(uRole)) return true;
    throw new ForbiddenException('Permission Denied');
  }
}
