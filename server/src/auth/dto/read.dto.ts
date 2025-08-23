import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PasswordBaseDto } from './post.dto';

export class GetResetTokenDto {
  @ApiProperty({ example: 'uTmSY02zliMnfGnAfBXnqMcmZaN0EJp_rTmysCDqlpg%3E' })
  @IsNotEmpty()
  @IsString()
  tk: string;
}

export class GetResetSessionDto extends PickType(PasswordBaseDto, [
  'resetSessionId',
] as const) {}
