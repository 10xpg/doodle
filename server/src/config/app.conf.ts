import { registerAs } from '@nestjs/config';

export default registerAs('app.conf', () => ({
  env: process.env.NODE_ENV,
  port: process.env.APP_PORT,
  baseUrl: process.env.APP_BASE,
}));
