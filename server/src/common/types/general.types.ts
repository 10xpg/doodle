export type Password = string | Buffer;

export interface AccessJwtContract {
  sub: string;
  email: string;
  role?: 'ADMIN' | 'CUSTOMER';
  iat?: number;
  exp?: number;
}

export interface RefreshJwtContract {
  sub: string;
  role?: 'ADMIN' | 'CUSTOMER';
  iat?: number;
  exp?: number;
}
