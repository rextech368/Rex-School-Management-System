import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import * as Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface WhatsAppOptions {
  to: string | string[];
  message?: string;
  template?: string;
  context?: Record<string, any>;
  from?: string;
  mediaUrl?: string;
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private client: twilio.Twilio;
  private readonly defaultFrom: string;
  private readonly templatesDir: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    
    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
      this.logger.log('WhatsApp service initialized');
    } else {
      this.logger.warn('WhatsApp service not configured. Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN');
    }

    this.defaultFrom = this.configService.get<string>('TWILIO_WHATSAPP_NUMBER');
    this.templatesDir = this.configService.get<string>('WHATSAPP_TEMPLATES_DIR') || 'templates/whatsapp';
  }

  /**
   * Send a WhatsApp message
   * @param options WhatsApp options
   * @returns Information about the sent message
   */
  async sendWhatsAppMessage(options: WhatsAppOptions): Promise<any> {
    try {
      if (!this.client) {
        this.logger.warn('WhatsApp service not configured. Skipping message sending.');
        return null;
      }

      const { to, message, template, context, mediaUrl } = options;
      const recipients = Array.isArray(to) ? to : [to];
      
      let messageContent = message;

      // If template is provided, render it
      if (template && !message) {
        messageContent = await this.renderTemplate(template, context || {});
      }

      if (!messageContent) {
        throw new Error('Either message or template must be provided');
      }

      // Format WhatsApp numbers
      const formattedRecipients = recipients.map(recipient => {
        // Ensure the number starts with "whatsapp:"
        return recipient.startsWith('whatsapp:') ? recipient : `whatsapp:${recipient}`;
      });

      // Format sender number
      const from = options.from || this.defaultFrom;
      const formattedFrom = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`;

      // Send WhatsApp message to each recipient
      const sendPromises = formattedRecipients.map(recipient => 
        this.client.messages.create({
          body: messageContent,
          from: formattedFrom,
          to: recipient,
          mediaUrl: mediaUrl ? [mediaUrl] : undefined,
        })
      );

      const results = await Promise.all(sendPromises);
      this.logger.log(`WhatsApp message sent successfully to ${recipients.join(', ')}`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Render a WhatsApp template
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
   * Send a welcome WhatsApp message to a new user
   * @param phoneNumber User phone number
   * @param name User name
   * @returns Information about the sent message
   */
  async sendWelcomeMessage(phoneNumber: string, name: string): Promise<any> {
    return this.sendWhatsAppMessage({
      to: phoneNumber,
      template: 'welcome',
      context: {
        name,
        loginUrl: this.configService.get<string>('FRONTEND_URL') + '/login',
      },
    });
  }

  /**
   * Send a notification about a new document upload
   * @param phoneNumber User phone number
   * @param name User name
   * @param documentTitle Document title
   * @param documentUrl Document URL (optional)
   * @returns Information about the sent message
   */
  async sendDocumentUploadNotification(
    phoneNumber: string,
    name: string,
    documentTitle: string,
    documentUrl?: string,
  ): Promise<any> {
    return this.sendWhatsAppMessage({
      to: phoneNumber,
      template: 'document-upload',
      context: {
        name,
        documentTitle,
      },
      mediaUrl: documentUrl,
    });
  }

  /**
   * Send a bulk WhatsApp message to multiple recipients
   * @param recipients Array of recipient objects with phone number and context
   * @param template Template name
   * @returns Array of results for each recipient
   */
  async sendBulkMessage(
    recipients: Array<{ phoneNumber: string; context: Record<string, any> }>,
    template: string,
  ): Promise<any[]> {
    const sendPromises = recipients.map(recipient => 
      this.sendWhatsAppMessage({
        to: recipient.phoneNumber,
        template,
        context: recipient.context,
      })
    );

    return Promise.all(sendPromises);
  }
}

