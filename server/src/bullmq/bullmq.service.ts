import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Queue } from 'bullmq';
import { appConfig } from 'src/config';

@Injectable()
export class BullmqService {
  constructor(
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) {}

  async dumpEmail(email: string, token: string) {
    await this.emailQueue.add('reset-password', {
      email,
      resetUrl: `${this.appConf.baseUrl}/auth/password-reset/verify?tk=${token}`,
    });
  }
}
