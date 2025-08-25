import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/report-cards/email-resend')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailResendController {
  constructor(@InjectQueue('reportcard-email') private emailQueue: Queue) {}

  @Post(':logId')
  @Roles('Admin', 'Principal', 'Head Teacher')
  async resend(@Param('logId') logId: string) {
    // Fetch log, get studentId, examId, etc.
    // ...fetch log...
    await this.emailQueue.add('sendStudentReportCard', { /* ... */ });
    return { status: 'queued' };
  }
}