import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, GetEmailDto, UserResponse } from 'src/users/dto';
import { ApiCreatedSuccessResponse } from 'src/common/decorators';
import {
  ApiSuccessResponse,
  ApiTokenResponse,
  ApiErrorResponse,
  ApiSuccessBaseResponse,
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

  @ApiOperation({ description: 'Creates an Account' })
  @ApiBody({ description: 'User details', type: CreateUserDto })
  @ApiCreatedSuccessResponse('Account Successfully Created', UserResponse)
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Post('register')
  async createUser(@Body() user: CreateUserDto) {
    const acc = await this.authService.registerUser(user);
    return new ApiSuccessResponse(
      'Customer creation successful',
      HttpStatus.CREATED,
      acc,
    );
  }

  @ApiOperation({ description: 'Creates a Bearer Token for Authentiction ' })
  @ApiBody({ description: 'Login credentials', type: TokenDto })
  @ApiOkResponse({
    description: 'Authentication Successful',
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
  @Post('token')
  async authenticate(@Body() credentials: TokenDto) {
    const tokens = await this.authService.loginUser(credentials);
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

  @ApiOperation({ description: 'Initiate Password Reset' })
  @ApiBody({ description: 'Reset Account identifier', type: GetEmailDto })
  @ApiOkResponse({
    description: 'Token generated',
    type: ApiSuccessBaseResponse,
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
  @Post('password-reset/request')
  async initReset(
    @Body() identifier: GetEmailDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const { email } = identifier;
    await this.authService.generateResetToken(email, ip, userAgent);
    return new ApiSuccessBaseResponse(
      'If account exists, you will receive email instructions',
      HttpStatus.OK,
    );
  }
}
