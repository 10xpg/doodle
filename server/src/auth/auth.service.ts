import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';
import { RefreshTokenDto, TokenDto } from './dto';
import { HashProvider } from './providers/hash.provider';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { authConfig } from './config';
import { RefreshJwtContract } from 'src/common/types';
import * as crypto from 'node:crypto';
import { AuthRepository } from './auth.repository';
import { BullmqService } from 'src/bullmq/bullmq.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private authConf: ConfigType<typeof authConfig>,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private hashProvider: HashProvider,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private queueService: BullmqService,
  ) {}

  async registerUser(user: CreateUserDto) {
    return await this.usersService.addNewUser(user);
  }

  async loginUser(credentials: TokenDto) {
    try {
      const user = await this.usersService.getUser(credentials.email);
      if (!user) throw new NotFoundException('User not found');
      const { password } = credentials;
      const { password: hash } = user;
      const validPassword = await this.hashProvider.compare(password, hash);
      if (!validPassword)
        throw new UnauthorizedException('Invalid credentials');
      const accessTokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
      const accessTokenOpts = {
        expiresIn: this.authConf.expiresIn,
      };
      const accessToken = await this.jwtService.signAsync(
        accessTokenPayload,
        accessTokenOpts,
      );
      const refreshTokenPayload = { sub: user.id };
      const refreshTokenOpts = {
        expiresIn: this.authConf.refreshTokenExpiresIn,
      };
      const refreshToken = await this.jwtService.signAsync(
        refreshTokenPayload,
        refreshTokenOpts,
      );
      return { accessToken, refreshToken };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async refreshToken(token: RefreshTokenDto) {
    try {
      const verifyJwtOpts = { secret: this.authConf.secret };
      const { sub } = await this.jwtService.verifyAsync<RefreshJwtContract>(
        token.refreshToken,
        verifyJwtOpts,
      );
      const user = await this.usersService.getUserById(sub);
      if (!user) throw new ForbiddenException('Failed to refresh token');
      const accessTokenPayload = {
        sub: user?.id,
        email: user?.email,
        role: user?.role,
      };
      const accessTokenOpts = {
        expiresIn: this.authConf.expiresIn,
      };
      const accessToken = await this.jwtService.signAsync(
        accessTokenPayload,
        accessTokenOpts,
      );
      const refreshTokenPayload = { sub: user?.id };
      const refreshTokenOpts = {
        expiresIn: this.authConf.refreshTokenExpiresIn,
      };
      const refreshToken = await this.jwtService.signAsync(
        refreshTokenPayload,
        refreshTokenOpts,
      );
      return { accessToken, refreshToken };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async generateResetToken(email: string, ip: string, userAgent?: string) {
    try {
      const user = await this.usersService.getUser(email);
      if (!user) return;
      const rawbytes = crypto.randomBytes(32);
      const token = rawbytes.toString('base64url');
      const hashedToken = await this.hashProvider.hash(token);
      await this.authRepository.add({
        userId: user?.id,
        hashedToken,
        purpose: 'Password Reset',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        requestIP: ip,
        requestUserAgent: userAgent,
      });
      await this.queueService.dumpEmail(email, token);
    } catch (e) {
      console.log(e);
    }
  }
}
