import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly phoneNumberId: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('WHATSAPP_API_URL', 'https://graph.facebook.com/v17.0');
    this.apiKey = this.configService.get<string>('WHATSAPP_API_KEY');
    this.phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID');
  }

  async sendWhatsApp(to: string, message: string): Promise<any> {
    try {
      // Format phone number (ensure it starts with country code)
      const formattedPhoneNumber = this.formatPhoneNumber(to);
      
      // Send WhatsApp message
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhoneNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      
      this.logger.log(`WhatsApp message sent to ${formattedPhoneNumber}`);
      
      return {
        success: true,
        messageId: response.data.messages[0].id,
        status: 'sent',
      };
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message: ${error.message}`, error.stack);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendWhatsAppTemplate(to: string, templateName: string, parameters: any[]): Promise<any> {
    try {
      // Format phone number (ensure it starts with country code)
      const formattedPhoneNumber = this.formatPhoneNumber(to);
      
      // Prepare template components
      const components = [
        {
          type: 'body',
          parameters: parameters,
        },
      ];
      
      // Send WhatsApp template message
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhoneNumber,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: 'en_US',
            },
            components: components,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      
      this.logger.log(`WhatsApp template message sent to ${formattedPhoneNumber}`);
      
      return {
        success: true,
        messageId: response.data.messages[0].id,
        status: 'sent',
      };
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp template message: ${error.message}`, error.stack);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async checkMessageStatus(messageId: string): Promise<any> {
    try {
      // Check message status
      const response = await axios.get(
        `${this.apiUrl}/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      
      return {
        success: true,
        status: response.data.status,
      };
    } catch (error) {
      this.logger.error(`Failed to check WhatsApp message status: ${error.message}`, error.stack);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If the number doesn't start with the country code (237 for Cameroon)
    if (!cleaned.startsWith('237')) {
      // If it starts with a 0, remove it and add country code
      if (cleaned.startsWith('0')) {
        cleaned = '237' + cleaned.substring(1);
      } else {
        // Otherwise just add country code
        cleaned = '237' + cleaned;
      }
    }
    
    return cleaned;
  }
}

