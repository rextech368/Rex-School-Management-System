import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: { /* SMTP or service config */ },
      defaults: { from: '"EDU-WISE" <noreply@yourdomain.com>' },
      template: {
        dir: process.cwd() + '/src/mailer/templates/',
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
})
export class AppMailerModule {}