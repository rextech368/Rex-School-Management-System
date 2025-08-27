import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import * as Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface SmsOptions {
  to: string | string[];
  message?: string;
  template?: string;
  context?: Record<string, any>;
  from?: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private client: twilio.Twilio;
  private readonly defaultFrom: string;
  private readonly templatesDir: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    
    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
      this.logger.log('SMS service initialized');
    } else {
      this.logger.warn('SMS service not configured. Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN');
    }

    this.defaultFrom = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    this.templatesDir = this.configService.get<string>('SMS_TEMPLATES_DIR') || 'templates/sms';
  }

  /**
   * Send an SMS
   * @param options SMS options
   * @returns Information about the sent SMS
   */
  async sendSms(options: SmsOptions): Promise<any> {
    try {
      if (!this.client) {
        this.logger.warn('SMS service not configured. Skipping SMS sending.');
        return null;
      }

      const { to, message, template, context } = options;
      const recipients = Array.isArray(to) ? to : [to];
      
      let messageContent = message;

      // If template is provided, render it
      if (template && !message) {
        messageContent = await this.renderTemplate(template, context || {});
      }

      if (!messageContent) {
        throw new Error('Either message or template must be provided');
      }

      // Send SMS to each recipient
      const sendPromises = recipients.map(recipient => 
        this.client.messages.create({
          body: messageContent,
          from: options.from || this.defaultFrom,
          to: recipient,
        })
      );

      const results = await Promise.all(sendPromises);
      this.logger.log(`SMS sent successfully to ${recipients.join(', ')}`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`);
      throw error;
    }
  }

  /**
   * Render an SMS template
   * @param templateName Template name
   * @param context Template context
   * @returns Rendered message content
   */
  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    try {
      // Read template
      const template = await fs.readFile(
        path.join(process.cwd(), this.templatesDir, `${templateName}.txt`),
        'utf8',
      );

      // Compile template
      const compiled = Handlebars.compile(template);

      // Render template with context
      return compiled(context);
    } catch (error) {
      this.logger.error(`Failed to render template ${templateName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send a welcome SMS to a new user
   * @param phoneNumber User phone number
   * @param name User name
   * @returns Information about the sent SMS
   */
  async sendWelcomeSms(phoneNumber: string, name: string): Promise<any> {
    return this.sendSms({
      to: phoneNumber,
      template: 'welcome',
      context: {
        name,
        loginUrl: this.configService.get<string>('FRONTEND_URL') + '/login',
      },
    });
  }

  /**
   * Send a password reset SMS
   * @param phoneNumber User phone number
   * @param name User name
   * @param resetToken Reset token
   * @returns Information about the sent SMS
   */
  async sendPasswordResetSms(phoneNumber: string, name: string, resetToken: string): Promise<any> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    return this.sendSms({
      to: phoneNumber,
      template: 'password-reset',
      context: {
        name,
        resetToken,
        resetUrl,
      },
    });
  }

  /**
   * Send a notification about a new document upload
   * @param phoneNumber User phone number
   * @param name User name
   * @param documentTitle Document title
   * @returns Information about the sent SMS
   */
  async sendDocumentUploadNotification(
    phoneNumber: string,
    name: string,
    documentTitle: string,
  ): Promise<any> {
    return this.sendSms({
      to: phoneNumber,
      template: 'document-upload',
      context: {
        name,
        documentTitle,
      },
    });
  }

  /**
   * Send a bulk SMS to multiple recipients
   * @param recipients Array of recipient objects with phone number and context
   * @param template Template name
   * @returns Array of results for each recipient
   */
  async sendBulkSms(
    recipients: Array<{ phoneNumber: string; context: Record<string, any> }>,
    template: string,
  ): Promise<any[]> {
    const sendPromises = recipients.map(recipient => 
      this.sendSms({
        to: recipient.phoneNumber,
        template,
        context: recipient.context,
      })
    );

    return Promise.all(sendPromises);
  }
}

