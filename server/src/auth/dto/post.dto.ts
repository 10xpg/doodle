import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsJWT,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class TokenDto {
  @ApiProperty({ example: 'johndoe@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd@1' })
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2QxNWQwYy01ZTdjLTQxOTEtOGFlZS1iMmFmZjZlMzNhZjAiLCJpYXQiOjE3NTUzNjk4MTYsImV4cCI6MTc1NTk3NDYxNn0.nIpGZv8-md7S9VhEqbSUxjn9eSAZvwNcvPo6IU3TYcU',
  })
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  refreshToken: string;
}

export class GenericTokenDto {
  @ApiProperty({ example: 'dd2bb6bc-a363-43e0-9275-b330b1c31b56' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hashedToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  purpose: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  expiresAt: Date;

  @ApiProperty()
  @IsOptional()
  requestIP?: string;

  @ApiProperty()
  @IsOptional()
  requestUserAgent?: string;
}

export class PasswordBaseDto {
  @ApiProperty({ example: 'dd2bb6bc-a363-43e0-9275-b330b1c31b56' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'email', example: 'johndoe@email.com' })
  @IsNotEmpty()
  @IsEmail(undefined)
  email: string;

  @ApiProperty({
    description: 'current password to be changed',
    example: 'oldpassword',
  })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: 'new password', example: 'newpassword' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,30}$/,
  )
  newPassword: string;

  @ApiProperty({ example: 'Xn9wTgIqk9Hc7aVhZJxOaVY6xJmVgq35jZyW2iR5e1c' })
  @IsNotEmpty()
  @IsString()
  resetSessionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  expiresAt: Date;
}

export class PasswordResetSessionDto extends PickType(PasswordBaseDto, [
  'userId',
  'expiresAt',
  'resetSessionId',
] as const) {}

export class PasswordResetVerifyResponse extends PickType(PasswordBaseDto, [
  'resetSessionId',
  'expiresAt',
] as const) {}

export class PasswordResetDto extends PickType(PasswordBaseDto, [
  'newPassword',
] as const) {}
