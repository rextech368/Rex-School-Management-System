import { EmailDeliveryLog } from './entities/email-delivery-log.entity';
import { Repository } from 'typeorm';
// Inject private emailLogRepo: Repository<EmailDeliveryLog> in constructor

// before sending email to a student:
const log = this.emailLogRepo.create({
  student,
  email: recipientEmail,
  exam_id: examId,
  class_id: classId,
  status: 'pending'
});
await this.emailLogRepo.save(log);

try {
  await this.mailerService.sendMail({ ... });
  log.status = 'sent';
  await this.emailLogRepo.save(log);
} catch (err) {
  log.status = 'failed';
  log.error_message = err.message;
  await this.emailLogRepo.save(log);
}