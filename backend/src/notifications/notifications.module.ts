import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Services
import { EmailService, SmsService, WhatsAppService, NotificationService } from './services';

// Controllers
import { NotificationsController, TemplatesController } from './controllers';

// Entities
import { NotificationTemplate } from './entities/notification-template.entity';
import { NotificationLog } from './entities/notification-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationTemplate, NotificationLog]),
    ConfigModule,
  ],
  controllers: [NotificationsController, TemplatesController],
  providers: [EmailService, SmsService, WhatsAppService, NotificationService],
  exports: [EmailService, SmsService, WhatsAppService, NotificationService],
})
export class NotificationsModule {}

