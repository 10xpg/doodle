import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseDto } from 'src/common/dto';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';

enum Gender {
  MALE = 'M',
  FEMALE = 'F',
}

export class UserDto extends BaseDto {
  @ApiProperty({
    description: "User's email address",
    example: 'johndoe@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    minLength: 8,
    maxLength: 30,
    example: 'P@ssw0rd@1',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,30}$/,
  )
  password: string;

  @ApiProperty({ description: "User's firstname", example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ description: "User's lastname", example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'Gender of user', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({
    description: 'Contact number',
    example: '1-737-733-3723',
  })
  @IsOptional()
  @IsMobilePhone()
  phone: string;
}

export class UserResponse extends OmitType(UserDto, [
  'password',
  'createdAt',
  'updatedAt',
  'gender',
] as const) {}
