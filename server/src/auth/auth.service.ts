import {
  ForbiddenException,
  forwardRef,
  HttpStatus,
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
import { AuthRepository } from './auth.repository';
import { BullmqService } from 'src/bullmq/bullmq.service';
import { ApiErrorResponse } from 'src/common/response';
import {
  provideExpiry,
  provideToken,
} from 'src/utils/generators/token.generator';
import { hashToken } from 'src/utils';

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
      const token = provideToken();
      console.log(token.length);
      console.log('tk: ', token);
      const expiresAt = provideExpiry();
      const hashedToken = hashToken(token);
      console.log('hash tk: ', hashedToken);
      await this.authRepository.addToken({
        userId: user?.id,
        hashedToken,
        purpose: 'Password Reset',
        expiresAt,
        requestIP: ip,
        requestUserAgent: userAgent,
      });
      await this.queueService.dumpEmail(email, token);
    } catch (e) {
      console.log(e);
    }
  }

  // BUG: Token recieved changes
  async verifyResetToken(token: string) {
    try {
      const reqHash = hashToken(token.trim());
      console.log(token.trim().length);
      console.log('hashInVerify: ', reqHash);
      const dbHash = await this.authRepository.retrieveToken(reqHash);
      console.log(dbHash);
      await this.authRepository.flagTokenAsUsed(reqHash);
      const tokenExp = new Date(Date.now()) > <Date>dbHash?.expiresAt;
      const expiresAt = provideExpiry();
      if (dbHash && !tokenExp) {
        const sessionId = provideToken();
        await this.authRepository.addResetSession({
          userId: dbHash.userId,
          expiresAt,
          resetSessionId: sessionId,
        });
        return { sessionId, expiresAt };
      } else {
        throw new ForbiddenException(
          new ApiErrorResponse(
            HttpStatus.FORBIDDEN,
            'Invalid or expired token.',
          ),
        );
      }
    } catch (e) {
      console.log(e);
    }
  }
}
