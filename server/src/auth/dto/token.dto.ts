import { IsEmail, IsNotEmpty } from 'class-validator';

export class TokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
