import * as crypto from 'node:crypto';

export const provideToken = function () {
  return crypto.randomBytes(32).toString('base64url');
};

export const provideExpiry = function () {
  return new Date(Date.now() + 15 * 60 * 1000);
};
