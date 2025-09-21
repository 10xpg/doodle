import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, GetEmailDto, UserResponse } from 'src/users/dto';
import {
  ApiCreatedSuccessResponse,
  ApiOkSuccessResponse,
} from 'src/common/decorators';
import {
  ApiSuccessResponse,
  ApiTokenResponse,
  ApiErrorResponse,
  ApiSuccessBaseResponse,
} from 'src/common/response';
import {
  GetResetSessionDto,
  GetResetTokenDto,
  PasswordResetDto,
  PasswordResetVerifyResponse,
  RefreshTokenDto,
  TokenDto,
} from './dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AllowAnonymousAccess } from './decorators/unknown.decorator';

@ApiTags('Authentication')
@AllowAnonymousAccess()
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
    @Req() req: Request,
  ) {
    const { email } = identifier;
    const userAgent = req.headers['user-agent'];
    await this.authService.generateResetToken(email, ip, userAgent);
    return new ApiSuccessBaseResponse(
      'If account exists, you will receive email instructions',
      HttpStatus.OK,
    );
  }

  @ApiOperation({ description: 'Verifies Password Reset Token' })
  @ApiOkSuccessResponse('Token verified', PasswordResetVerifyResponse, false)
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Get('password-reset/verify')
  async verifyReset(@Query() qstrings: GetResetTokenDto) {
    const { tk } = qstrings;
    const results = await this.authService.verifyResetToken(tk);
    console.log(results);
    return new ApiSuccessResponse(
      'Reset token verification successful',
      HttpStatus.OK,
      results,
    );
  }

  @ApiOperation({ description: 'Reset Password' })
  @ApiOkResponse({
    description: 'Password reset successful',
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
  @Post('password-reset/confirm/:sid')
  async resetPassword(
    @Param() params: GetResetSessionDto,
    @Body() body: PasswordResetDto,
  ) {
    const { newPassword } = body;
    const { sid } = params;
    await this.authService.confirmReset(sid, newPassword);
    return new ApiSuccessBaseResponse(
      'Password reset successful',
      HttpStatus.CREATED,
    );
  }
}
