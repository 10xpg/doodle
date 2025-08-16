import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponse {
  @ApiProperty()
  statusCode: number;
  @ApiProperty({ example: 'Operation Failed' })
  message: string;
  @ApiProperty({ example: 'An unexpected error occured' })
  error: string;

  constructor(statusCode: number, message: string, error: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}
