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
      const expiresAt = provideExpiry();
      const hashedToken = hashToken(token);
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

  async verifyResetToken(token: string) {
    try {
      const reqHash = hashToken(token);
      const dbToken = await this.authRepository.retrieveToken(reqHash);
      const tokenExpired = new Date(Date.now()) > <Date>dbToken?.expiresAt;
      if (!dbToken) throw new ForbiddenException('Invalid or expired token.');
      if (tokenExpired) {
        await this.authRepository.flagFailedAttempt(reqHash);
        throw new ForbiddenException('Invalid or expired token.');
      }
      if (dbToken.usedAt) {
        await this.authRepository.flagFailedAttempt(reqHash);
        throw new ForbiddenException('Invalid or expired token.');
      }
      if (dbToken.attempts >= 3)
        throw new ForbiddenException(
          new ApiErrorResponse(HttpStatus.FORBIDDEN, 'Too many attempts'),
        );
      const sessionId = provideToken();
      const expiresAt = provideExpiry();
      await this.authRepository.addResetSid({
        userId: dbToken.userId,
        expiresAt,
        resetSessionId: sessionId,
      });
      await this.authRepository.flagTokenAsUsed(reqHash);
      return { sessionId, expiresAt };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async confirmReset(sid: string, password: string) {
    try {
      const session = await this.authRepository.retrieveSid(sid);
      const sidExpired = new Date(Date.now()) > <Date>session?.expiresAt;
      if (!session)
        throw new ForbiddenException('Invalid or expired reset sid');
      if (sidExpired || session?.used)
        throw new ForbiddenException('Invalid or expired reset sid');
      const newHashedPassword = await this.hashProvider.hash(password);
      await this.authRepository.updatePassword(
        session?.userId,
        newHashedPassword,
      );
      await this.authRepository.flagSidAsUsed(sid);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
