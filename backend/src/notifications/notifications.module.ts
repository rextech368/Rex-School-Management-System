import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { WhatsAppService } from './whatsapp.service';
import { MtnCameroonSmsService } from './sms/mtn-cameroon.service';
import { OrangeCameroonSmsService } from './sms/orange-cameroon.service';
import { ParentNotificationLog } from '../parents/entities/parent-notification-log.entity';
import { Parent } from '../parents/entities/parent.entity';
import { Student } from '../students/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParentNotificationLog, Parent, Student]),
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        transport: {
          host: configService.get('MAIL_HOST', 'smtp.example.com'),
          port: configService.get('MAIL_PORT', 587),
          secure: configService.get('MAIL_SECURE', false),
          auth: {
            user: configService.get('MAIL_USER', 'user@example.com'),
            pass: configService.get('MAIL_PASSWORD', 'password'),
          },
        },
        defaults: {
          from: configService.get('MAIL_FROM', '"School Admin" <admin@school.edu>'),
        },
        template: {
          dir: process.cwd() + '/templates/email',
          adapter: 'handlebars',
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    WhatsAppService,
    MtnCameroonSmsService,
    OrangeCameroonSmsService,
  ],
  exports: [
    NotificationService,
    WhatsAppService,
    MtnCameroonSmsService,
    OrangeCameroonSmsService,
  ],
})
export class NotificationsModule {}

