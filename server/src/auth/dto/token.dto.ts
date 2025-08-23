import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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

export class PasswordResetSessionDto extends PickType(GenericTokenDto, [
  'userId',
  'expiresAt',
] as const) {
  @ApiProperty({ example: 'Xn9wTgIqk9Hc7aVhZJxOaVY6xJmVgq35jZyW2iR5e1c' })
  @IsNotEmpty()
  @IsString()
  resetSessionId: string;
}

export class PasswordResetVerifyResponse extends PickType(
  PasswordResetSessionDto,
  ['resetSessionId', 'expiresAt'] as const,
) {}
