import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParentNotificationLog } from '../parents/entities/parent-notification-log.entity';
import { Repository } from 'typeorm';

@Controller('api/v1/notifications/sms-webhook')
export class SMSWebhookController {
  constructor(
    @InjectRepository(ParentNotificationLog) private logRepo: Repository<ParentNotificationLog>
  ) {}

  @Post()
  async handleSMSStatus(@Body() body: any) {
    // Parse SMS provider payload for messageId, delivery status, etc.
    const log = await this.logRepo.findOne({ where: { id: body.logId } });
    if (log) {
      log.sms_delivery_status = body.status; // e.g., 'delivered', 'failed'
      log.status = body.status === 'delivered' ? 'delivered' : 'failed';
      await this.logRepo.save(log);
    }
    return { status: 'ok' };
  }
}