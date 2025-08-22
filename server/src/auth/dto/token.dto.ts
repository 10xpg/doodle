import { ApiProperty } from '@nestjs/swagger';
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

  @IsNotEmpty()
  @IsString()
  hashedToken: string;

  @IsNotEmpty()
  @IsString()
  purpose: string;

  @IsNotEmpty()
  @IsDate()
  expiresAt: Date;

  @IsOptional()
  requestIP?: string;

  @IsOptional()
  requestUserAgent?: string;
}
