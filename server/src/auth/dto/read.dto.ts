import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetResetTokenDto {
  @ApiProperty({ example: 'uTmSY02zliMnfGnAfBXnqMcmZaN0EJp_rTmysCDqlpg%3E' })
  @IsNotEmpty()
  @IsString()
  tk: string;
}
