import { Controller, Post, Body, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailDeliveryLog } from './entities/email-delivery-log.entity';
import { Repository } from 'typeorm';

@Controller('api/v1/report-cards/email-webhook')
export class EmailWebhookController {
  constructor(
    @InjectRepository(EmailDeliveryLog) private emailLogRepo: Repository<EmailDeliveryLog>
  ) {}

  @Post()
  async handleWebhook(@Body() body: any, @Req() req) {
    // Example for Mailgun: body['event'], body['recipient'], body['message-id']
    // Find log by recipient and message-id, then update status accordingly
    const event = body['event'] || body['event-data']?.event;
    const recipient = body['recipient'] || body['event-data']?.recipient;
    const messageId = body['Message-Id'] || body['event-data']?.['message']['headers']['message-id'];

    if (!recipient || !event) return { status: 'ignored' };

    let log = await this.emailLogRepo.findOne({ where: { email: recipient }, order: { updated_at: 'DESC' } });
    if (log) {
      if (event === 'delivered') {
        log.status = 'delivered';
      } else if (event === 'bounced') {
        log.status = 'bounced';
        log.error_message = body['error'] || body['event-data']?.delivery_status?.description;
      }
      await this.emailLogRepo.save(log);
      return { status: 'updated' };
    }
    return { status: 'not_found' };
  }
}