import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserResponse } from 'src/users/dto';
import { ApiCreatedSuccessResponse } from 'src/common/decorators';
import {
  ApiSuccessResponse,
  ApiTokenResponse,
  ApiErrorResponse,
} from 'src/common/response';
import { RefreshTokenDto, TokenDto } from './dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ description: 'Creates an Administrator Account' })
  @ApiBody({ description: 'Administrator details', type: CreateUserDto })
  @ApiCreatedSuccessResponse('Account Successfully Created', UserResponse)
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Post('register/admins')
  async createAdmin(@Body() user: CreateUserDto) {
    const admin = await this.authService.registerAdmin(user);
    return new ApiSuccessResponse(
      'Administrator creation successful',
      HttpStatus.CREATED,
      admin,
    );
  }

  @ApiOperation({ description: 'Creates a Customer Account' })
  @ApiBody({ description: 'Customers details', type: CreateUserDto })
  @ApiCreatedSuccessResponse('Account Successfully Created', UserResponse)
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Post('register/customers')
  async createCustomer(@Body() user: CreateUserDto) {
    const customer = await this.authService.registerCustomer(user);
    return new ApiSuccessResponse(
      'Customer creation successful',
      HttpStatus.CREATED,
      customer,
    );
  }

  @ApiOperation({ description: 'Creates a Bearer Token for Authentiction ' })
  @ApiBody({ description: 'Login credentials', type: TokenDto })
  @ApiOkResponse({
    description: 'Administrator Authentication Successful',
    type: ApiTokenResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('token/admins')
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

  @ApiOperation({ description: 'Creates a Bearer Token for Authentiction ' })
  @ApiBody({ description: 'Login credentials', type: TokenDto })
  @ApiOkResponse({
    description: 'Customer Authentication Successful',
    type: ApiTokenResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('token/customers')
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

  @ApiOperation({ description: 'Creates a Bearer Token for Authentiction ' })
  @ApiBody({ description: 'Refresh token', type: RefreshTokenDto })
  @ApiOkResponse({
    description: 'Access Token Refresh Successful',
    type: ApiTokenResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
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
