import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParentNotificationLog } from '../parents/entities/parent-notification-log.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/notifications/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationAnalyticsController {
  constructor(
    @InjectRepository(ParentNotificationLog) private logRepo: Repository<ParentNotificationLog>
  ) {}

  @Get()
  @Roles('Admin', 'Principal', 'Head Teacher')
  async getAnalytics(@Query('class_id') class_id: string, @Query('exam_id') exam_id: string) {
    // Count by type/status
    const total = await this.logRepo.count({ where: { class_id, exam_id } });
    const opened = await this.logRepo.count({ where: { class_id, exam_id, status: 'opened' } });
    const clicked = await this.logRepo.count({ where: { class_id, exam_id, status: 'clicked' } });
    const smsDelivered = await this.logRepo.count({ where: { class_id, exam_id, notification_type: 'sms', sms_delivery_status: 'delivered' } });
    const smsFailed = await this.logRepo.count({ where: { class_id, exam_id, notification_type: 'sms', sms_delivery_status: 'failed' } });
    return {
      total,
      opened,
      clicked,
      openRate: total ? (opened / total) * 100 : 0,
      clickRate: total ? (clicked / total) * 100 : 0,
      smsDelivered,
      smsFailed,
    };
  }
}