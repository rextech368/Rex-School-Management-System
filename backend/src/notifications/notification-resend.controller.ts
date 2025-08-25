import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationResendController {
  constructor(private notificationService: NotificationService) {}

  @Post('resend/:logId')
  @Roles('Admin', 'Principal', 'Head Teacher')
  async resend(@Param('logId') logId: string) {
    return this.notificationService.resendNotification(+logId);
  }

  @Post('remind/:parentId/:examId')
  @Roles('Admin', 'Principal', 'Head Teacher')
  async remind(@Param('parentId') parentId: string, @Param('examId') examId: string) {
    return this.notificationService.sendReminderToParent(+parentId, +examId);
  }
}