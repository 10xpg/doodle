import { registerAs } from '@nestjs/config';

export default registerAs('appConf', () => ({
  env: process.env.NODE_ENV,
  port: process.env.APP_PORT,
}));
