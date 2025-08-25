import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

// ...
@Controller('api/v1/report-cards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportCardController {
  constructor(@InjectQueue('reportcard-email') private emailQueue: Queue) {}

  @Post('class/:classId/exam/:examId/bulk-email')
  @Roles('Admin', 'Principal', 'Head Teacher')
  async bulkEmail(
    @Param('classId') classId: string,
    @Param('examId') examId: string
  ) {
    await this.emailQueue.add('sendBulk', { classId: +classId, examId: +examId });
    return { status: 'queued', message: 'Bulk email job has been queued.' };
  }
}