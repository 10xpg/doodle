export class ApiSuccessBaseResponse {
  message: string;
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
  accessToken: string;
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
