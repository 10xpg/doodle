import * as crypto from 'node:crypto';

export const hashToken = function (token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
};
