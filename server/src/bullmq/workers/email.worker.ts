import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from 'src/email/email.service';

@Processor('email')
export class EmailConsumer extends WorkerHost {
  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'reset-password':
        await this.emailService.sendPasswordResetMail(
          job.data?.email,
          '"Doodle Services" <antoinegbezeh17@gmail.com>',
          'Reset Password Request',
        );
        break;
    }
  }
}
