import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ParentNotificationLog } from '../parents/entities/parent-notification-log.entity';
import { Repository } from 'typeorm';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationReminderService {
  private readonly logger = new Logger(NotificationReminderService.name);

  constructor(
    @InjectRepository(ParentNotificationLog) private logRepo: Repository<ParentNotificationLog>,
    private notificationService: NotificationService,
  ) {}

  // Run daily at 8am UTC
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendRemindersForUnresponsiveParents() {
    // Find all parents who have NOT opened/clicked report card notification in last X days
    const unresponsiveLogs = await this.logRepo.query(`
      SELECT DISTINCT parentId, exam_id
      FROM parent_notification_logs
      WHERE notification_type = 'email'
        AND (status != 'opened' AND status != 'clicked')
        AND created_at > NOW() - INTERVAL '7 days'
    `);
    for (const entry of unresponsiveLogs) {
      this.logger.log(`Sending reminder to parent ${entry.parentid} for exam ${entry.exam_id}`);
      await this.notificationService.sendReminderToParent(entry.parentid, entry.exam_id);
      // Optionally, add a log entry for the reminder
    }
  }
}