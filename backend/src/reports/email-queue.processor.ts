import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { EmailDeliveryLog } from './entities/email-delivery-log.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';

@Processor('reportcard-email')
export class EmailQueueProcessor {
  constructor(
    private mailer: MailerService,
    private emailLogRepo: Repository<EmailDeliveryLog>
  ) {}

  @Process('sendStudentReportCard')
  async handleStudentEmail(job: Job) {
    const { studentId, examId, classId, logId } = job.data;
    const log = await this.emailLogRepo.findOne({ where: { id: logId }, relations: ['student'] });
    if (!log) return;

    try {
      // ... (generate PDF, template, etc.)
      await this.mailer.sendMail({ /* ... */ });
      log.status = 'sent';
      log.retry_count = job.attemptsMade;
      log.last_attempt_at = new Date();
      await this.emailLogRepo.save(log);
    } catch (err) {
      log.status = 'failed';
      log.error_message = err.message;
      log.retry_count = job.attemptsMade;
      log.last_attempt_at = new Date();
      await this.emailLogRepo.save(log);
      throw err; // Bull will retry according to attempts setting
    }
  }
}