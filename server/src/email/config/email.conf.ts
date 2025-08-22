import { registerAs } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export default registerAs('email.conf', () => ({
  transport: process.env.EMAIL_TRANSPORT,
  defaults: { from: '"doodle-org" <antoinegbezeh17@gmail.com>' },
  template: {
    dir: process.cwd() + '/templates/',
    adapter: new EjsAdapter(),
    options: {
      strict: true,
    },
  },
}));
