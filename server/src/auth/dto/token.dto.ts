import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class TokenDto {
  @ApiProperty({ example: 'johndoe@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd@1' })
  @IsNotEmpty()
  password: string;
}
