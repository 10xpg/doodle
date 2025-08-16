import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePasswordDto {
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
}
