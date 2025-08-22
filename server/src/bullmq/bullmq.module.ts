import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullmqService } from './bullmq.service';
import { bullmqConfig } from './config';
import { EmailConsumer } from './workers';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    BullModule.forRootAsync(bullmqConfig.asProvider()),
    BullModule.registerQueueAsync({ name: 'email' }),
    EmailModule,
  ],
  providers: [BullmqService, EmailConsumer],
  exports: [BullmqService],
})
export class BullmqModule {}
