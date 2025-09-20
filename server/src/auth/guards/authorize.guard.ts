import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { authConfig } from '../config';
import { AccessJwtContract } from 'src/common/types';
import { Reflector } from '@nestjs/core';
import { REQ_USER_KEY } from 'src/common/constants';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    @Inject(authConfig.KEY)
    private authConf: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const jwt = request.headers.authorization?.split(' ')[1];
    if (!jwt) throw new UnauthorizedException();
    const verifyJwtOpts = { secret: this.authConf.secret };
    try {
      const payload: AccessJwtContract = await this.jwtService.verifyAsync(
        jwt,
        verifyJwtOpts,
      );
      request[REQ_USER_KEY] = payload;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(err.message);
    }

    return true;
  }
}
