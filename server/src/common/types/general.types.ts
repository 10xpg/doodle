export type Password = string | Buffer;

export type QueryOpts = { skip?: number; take?: number; where?: object };

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

export interface ResetPasswordJob {
  email: string;
  resetUrl: string;
}

export class PaginationMetadata {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export class PaginationLinks {
  firstPage: string;
  lastPage: string;
  currentPage: string;
  nextPage: string;
  previousPage: string;
}
