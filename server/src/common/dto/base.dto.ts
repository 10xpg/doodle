import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BaseDto {
  @ApiProperty({
    description: 'A unique identifier for the entity',
    example: 'dd2bb6bc-a363-43e0-9275-b330b1c31b56',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;
}
