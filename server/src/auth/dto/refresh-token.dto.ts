import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2QxNWQwYy01ZTdjLTQxOTEtOGFlZS1iMmFmZjZlMzNhZjAiLCJpYXQiOjE3NTUzNjk4MTYsImV4cCI6MTc1NTk3NDYxNn0.nIpGZv8-md7S9VhEqbSUxjn9eSAZvwNcvPo6IU3TYcU',
  })
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  refreshToken: string;
}
