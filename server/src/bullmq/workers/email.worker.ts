import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ResetPasswordJob } from 'src/common/types';
import { EmailService } from 'src/email/email.service';

@Processor('email')
export class EmailConsumer extends WorkerHost {
  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job<ResetPasswordJob>) {
    const { email, resetUrl } = job.data;
    switch (job.name) {
      case 'reset-password':
        await this.emailService.sendPasswordResetMail(
          email,
          '"Doodle" <antoinegbezeh17@gmail.com>',
          'Reset Password Request',
          resetUrl,
        );
        break;
    }
  }
}
