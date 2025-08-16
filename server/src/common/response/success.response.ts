import { ApiProperty } from '@nestjs/swagger';

export class ApiSuccessBaseResponse {
  @ApiProperty({ example: 'Operation successful' })
  message: string;
  @ApiProperty()
  statusCode: number;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class ApiSuccessResponse<T> extends ApiSuccessBaseResponse {
  data?: T;

  constructor(message: string, statusCode: number, data?: T) {
    super(message, statusCode);
    this.data = data;
  }
}

export class ApiTokenResponse<T> extends ApiSuccessResponse<T> {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2QxNWQwYy01ZTdjLTQxOTEtOGFlZS1iMmFmZjZlMzNhZjAiLCJlbWFpbCI6ImpvaG5kb2VAZW1haWwuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzU1MzY5ODE2LCJleHAiOjE3NTUzNzE2MTZ9.mbmJ_lTCy3Z5X_WYPJnI5NPcIwf87a1lA7YFQMCtJdE',
  })
  accessToken: string;
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2QxNWQwYy01ZTdjLTQxOTEtOGFlZS1iMmFmZjZlMzNhZjAiLCJpYXQiOjE3NTUzNjk4MTYsImV4cCI6MTc1NTk3NDYxNn0.nIpGZv8-md7S9VhEqbSUxjn9eSAZvwNcvPo6IU3TYcU',
  })
  refreshToken: string;

  constructor(
    message: string,
    statusCode: number,
    accessToken: string,
    refreshToken: string,
  ) {
    super(message, statusCode);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
