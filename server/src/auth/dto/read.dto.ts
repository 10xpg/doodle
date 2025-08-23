import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetResetTokenDto {
  @ApiProperty({ example: 'uTmSY02zliMnfGnAfBXnqMcmZaN0EJp_rTmysCDqlpg%3E' })
  @IsNotEmpty()
  @IsString()
  tk: string;
}

export class GetResetSessionDto {
  @ApiProperty({ example: 'Xn9wTgIqk9Hc7aVhZJxOaVY6xJmVgq35jZyW2iR5e1c' })
  @IsNotEmpty()
  @IsString()
  sid: string;
}
