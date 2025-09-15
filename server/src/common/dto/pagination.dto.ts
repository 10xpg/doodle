import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  limit?: number = 10;

  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  page?: number = 1;
}
