import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto';
import { ApiSuccessResponse, ApiTokenResponse } from 'src/common/response';
import { RefreshTokenDto, TokenDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/admin')
  async createAdmin(@Body() user: CreateUserDto) {
    const admin = await this.authService.registerAdmin(user);
    return new ApiSuccessResponse(
      'Administrator creation successful',
      HttpStatus.CREATED,
      admin,
    );
  }

  @Post('register/customer')
  async createCustomer(@Body() user: CreateUserDto) {
    const customer = await this.authService.registerCustomer(user);
    return new ApiSuccessResponse(
      'Customer creation successful',
      HttpStatus.CREATED,
      customer,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('token/admin')
  async authenticateAdmin(@Body() credentials: TokenDto) {
    const tokens = await this.authService.loginAdmin(credentials);
    const { accessToken, refreshToken } = tokens;
    return new ApiTokenResponse(
      'Authentication successful',
      HttpStatus.OK,
      accessToken,
      refreshToken,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('token/customer')
  async authenticateCustomer(@Body() credentials: TokenDto) {
    const tokens = await this.authService.loginCustomer(credentials);
    const { accessToken, refreshToken } = tokens;
    return new ApiTokenResponse(
      'Authentication successful',
      HttpStatus.OK,
      accessToken,
      refreshToken,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('token/refresh')
  async refreshToken(@Body() token: RefreshTokenDto) {
    const tokens = await this.authService.refreshToken(token);
    const { accessToken, refreshToken } = tokens;
    return new ApiTokenResponse(
      'Authentication successful',
      HttpStatus.OK,
      accessToken,
      refreshToken,
    );
  }
}
