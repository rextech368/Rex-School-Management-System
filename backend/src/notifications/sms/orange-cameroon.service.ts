import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OrangeCameroonSmsService {
  private readonly logger = new Logger(OrangeCameroonSmsService.name);
  private readonly apiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly senderId: string;
  private accessToken: string;
  private tokenExpiry: Date;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('ORANGE_SMS_API_URL');
    this.clientId = this.configService.get<string>('ORANGE_SMS_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('ORANGE_SMS_CLIENT_SECRET');
    this.senderId = this.configService.get<string>('ORANGE_SMS_SENDER_ID');
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/oauth/v3/token`,
        {
          grant_type: 'client_credentials',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          },
        },
      );

      this.accessToken = response.data.access_token;
      // Set token expiry (usually 1 hour)
      this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      this.logger.error(`Failed to get Orange access token: ${error.message}`, error.stack);
      throw new Error('Failed to authenticate with Orange SMS API');
    }
  }

  async sendSms(phoneNumber: string, message: string): Promise<any> {
    try {
      // Format phone number (ensure it starts with country code)
      const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
      
      // Get access token
      const token = await this.getAccessToken();
      
      // Send SMS
      const response = await axios.post(
        `${this.apiUrl}/smsmessaging/v1/outbound/tel:${this.senderId}/requests`,
        {
          outboundSMSMessageRequest: {
            address: `tel:${formattedPhoneNumber}`,
            senderAddress: `tel:${this.senderId}`,
            outboundSMSTextMessage: {
              message: message,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      
      this.logger.log(`SMS sent to ${formattedPhoneNumber} via Orange Cameroon`);
      
      return {
        success: true,
        messageId: response.data.outboundSMSMessageRequest.resourceURL.split('/').pop(),
        status: 'sent',
      };
    } catch (error) {
      this.logger.error(`Failed to send SMS via Orange Cameroon: ${error.message}`, error.stack);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async checkDeliveryStatus(messageId: string): Promise<any> {
    try {
      // Get access token
      const token = await this.getAccessToken();
      
      // Check delivery status
      const response = await axios.get(
        `${this.apiUrl}/smsmessaging/v1/outbound/requests/${messageId}/deliveryInfos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      
      return {
        success: true,
        status: response.data.deliveryInfos[0].deliveryStatus,
      };
    } catch (error) {
      this.logger.error(`Failed to check SMS delivery status: ${error.message}`, error.stack);
      
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

