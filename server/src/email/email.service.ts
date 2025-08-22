import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendPasswordResetMail(to, from: string, subject: string) {
    this.mailerService
      .sendMail({
        to,
        from,
        subject,
        template: 'index',
        context: { code: 'cf1a3f828287', username: 'john doe' },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
