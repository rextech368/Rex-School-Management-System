import { Injectable } from '@nestjs/common';
@Injectable()
export class WhatsAppService {
  async sendWhatsApp(to: string, message: string) {
    // Use WhatsApp API (e.g. Twilio, Vonage)
  }
}