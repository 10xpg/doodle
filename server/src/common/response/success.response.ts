export class ApiSuccessResponse<T> {
  message: string;
  statusCode: number;
  data?: T;

  constructor(message: string, statusCode: number, data?: T) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
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
