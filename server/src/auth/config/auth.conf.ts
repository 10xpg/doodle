import { registerAs } from '@nestjs/config';

export default registerAs('auth.conf', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.ACCESS_JWT_EXPIRESIN,
  refreshTokenExpiresIn: process.env.REFRESH_JWT_EXPIRESIN,
}));
