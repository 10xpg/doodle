import { registerAs } from '@nestjs/config';

export default registerAs('bullmq.conf', () => ({
  connection: {
    host: process.env.QUEUE_HOST,
    port: process.env.QUEUE_PORT ? parseInt(process.env.QUEUE_PORT) : 6379,
  },
  defaultJobOptions: { attempts: 3 },
}));
