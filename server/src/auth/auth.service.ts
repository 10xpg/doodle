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

@Injectable()
export class AuthService {
  constructor(
    private hashProvider: HashProvider,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(authConfig.KEY)
    private authConf: ConfigType<typeof authConfig>,
  ) {}

  async registerAdmin(adminUser: CreateUserDto) {
    return await this.usersService.addNewAdmin(adminUser);
  }

  async registerCustomer(customerUser: CreateUserDto) {
    return await this.usersService.addNewCustomer(customerUser);
  }

  async loginAdmin(credentials: TokenDto) {
    try {
      const user = await this.usersService.getAdmin(credentials);
      if (!user) throw new NotFoundException('Administrator not found');
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

  async loginCustomer(credentials: TokenDto) {
    try {
      const user = await this.usersService.getCustomer(credentials);
      if (!user) throw new NotFoundException('Customer not found');
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
      // case1. user is a customer
      let user = await this.usersService.getCustomerById(sub);
      // case2. user is an admin
      if (!user) user = await this.usersService.getAdminById(sub);
      // case3. user is not in system
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
}
