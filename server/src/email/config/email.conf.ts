import { registerAs } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export default registerAs('email.conf', () => ({
  transport: process.env.EMAIL_TRANSPORT,
  defaults: { from: '"Doodle" <antoinegbezeh17@gmail.com>' },
  // preview: true,
  template: {
    dir: process.cwd() + '/templates/',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
}));
