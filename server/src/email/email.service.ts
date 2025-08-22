import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendPasswordResetMail(to, from: string, subject: string, resetUrl) {
    this.mailerService
      .sendMail({
        to,
        from,
        subject,
        template: 'reset-password',
        context: { resetLink: resetUrl },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
