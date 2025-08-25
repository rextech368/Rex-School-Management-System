import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { BulkEmailService } from './bulk-email.service';

@Processor('reportcard-email')
export class BulkEmailQueueProcessor {
  constructor(private bulkEmailService: BulkEmailService) {}

  @Process()
  async handleBulkEmail(job: Job) {
    // job.data: { classId, examId }
    return this.bulkEmailService.sendBulkReportCards(job.data.classId, job.data.examId);
  }
}