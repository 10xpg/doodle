import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { emailConfig } from './config';

@Module({
  imports: [MailerModule.forRootAsync(emailConfig.asProvider())],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
