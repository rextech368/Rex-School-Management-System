import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { WhatsAppService } from './whatsapp.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from '../entities/notification-template.entity';
import { NotificationLog } from '../entities/notification-log.entity';
import { NotificationChannel } from '../enums/notification-channel.enum';
import { NotificationType } from '../enums/notification-type.enum';

export interface NotificationOptions {
  userId?: string;
  email?: string;
  phoneNumber?: string;
  name?: string;
  type: NotificationType;
  context?: Record<string, any>;
  channels?: NotificationChannel[];
  attachments?: Array<{
    filename: string;
    path: string;
    contentType?: string;
  }>;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private emailService: EmailService,
    private smsService: SmsService,
    private whatsAppService: WhatsAppService,
    @InjectRepository(NotificationTemplate)
    private templateRepository: Repository<NotificationTemplate>,
    @InjectRepository(NotificationLog)
    private logRepository: Repository<NotificationLog>,
  ) {}

  /**
   * Send a notification through multiple channels
   * @param options Notification options
   * @returns Results of the notification sending
   */
  async sendNotification(options: NotificationOptions): Promise<any> {
    try {
      const { userId, email, phoneNumber, name, type, context, channels, attachments } = options;
      
      // Default to all channels if none specified
      const notificationChannels = channels || [
        NotificationChannel.EMAIL,
        NotificationChannel.SMS,
        NotificationChannel.WHATSAPP,
      ];

      // Get template for this notification type
      const template = await this.templateRepository.findOne({
        where: { type },
      });

      if (!template) {
        this.logger.warn(`No template found for notification type: ${type}`);
        return null;
      }

      const results = {
        email: null,
        sms: null,
        whatsapp: null,
      };

      // Send through each channel
      const sendPromises = [];

      // Email notification
      if (notificationChannels.includes(NotificationChannel.EMAIL) && email && template.emailTemplate) {
        sendPromises.push(
          this.emailService.sendEmail({
            to: email,
            subject: template.emailSubject,
            template: template.emailTemplate,
            context: {
              name,
              ...context,
            },
            attachments,
          }).then(result => {
            results.email = result;
            return this.logNotification(userId, type, NotificationChannel.EMAIL, email, true);
          }).catch(error => {
            this.logger.error(`Failed to send email notification: ${error.message}`);
            return this.logNotification(userId, type, NotificationChannel.EMAIL, email, false, error.message);
          })
        );
      }

      // SMS notification
      if (notificationChannels.includes(NotificationChannel.SMS) && phoneNumber && template.smsTemplate) {
        sendPromises.push(
          this.smsService.sendSms({
            to: phoneNumber,
            template: template.smsTemplate,
            context: {
              name,
              ...context,
            },
          }).then(result => {
            results.sms = result;
            return this.logNotification(userId, type, NotificationChannel.SMS, phoneNumber, true);
          }).catch(error => {
            this.logger.error(`Failed to send SMS notification: ${error.message}`);
            return this.logNotification(userId, type, NotificationChannel.SMS, phoneNumber, false, error.message);
          })
        );
      }

      // WhatsApp notification
      if (notificationChannels.includes(NotificationChannel.WHATSAPP) && phoneNumber && template.whatsappTemplate) {
        sendPromises.push(
          this.whatsAppService.sendWhatsAppMessage({
            to: phoneNumber,
            template: template.whatsappTemplate,
            context: {
              name,
              ...context,
            },
          }).then(result => {
            results.whatsapp = result;
            return this.logNotification(userId, type, NotificationChannel.WHATSAPP, phoneNumber, true);
          }).catch(error => {
            this.logger.error(`Failed to send WhatsApp notification: ${error.message}`);
            return this.logNotification(userId, type, NotificationChannel.WHATSAPP, phoneNumber, false, error.message);
          })
        );
      }

      // Wait for all notifications to be sent
      await Promise.all(sendPromises);

      return results;
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
      throw error;
    }
  }

  /**
   * Log a notification
   * @param userId User ID
   * @param type Notification type
   * @param channel Notification channel
   * @param recipient Recipient (email or phone number)
   * @param success Whether the notification was successful
   * @param errorMessage Error message if the notification failed
   * @returns The created log entry
   */
  private async logNotification(
    userId: string,
    type: NotificationType,
    channel: NotificationChannel,
    recipient: string,
    success: boolean,
    errorMessage?: string,
  ): Promise<NotificationLog> {
    try {
      const log = this.logRepository.create({
        userId,
        type,
        channel,
        recipient,
        success,
        errorMessage,
      });

      return this.logRepository.save(log);
    } catch (error) {
      this.logger.error(`Failed to log notification: ${error.message}`);
      return null;
    }
  }

  /**
   * Send a welcome notification
   * @param userId User ID
   * @param email User email
   * @param phoneNumber User phone number
   * @param name User name
   * @param password User password (if applicable)
   * @param channels Notification channels
   * @returns Results of the notification sending
   */
  async sendWelcomeNotification(
    userId: string,
    email: string,
    phoneNumber: string,
    name: string,
    password?: string,
    channels?: NotificationChannel[],
  ): Promise<any> {
    return this.sendNotification({
      userId,
      email,
      phoneNumber,
      name,
      type: NotificationType.WELCOME,
      context: {
        password,
        loginUrl: 'https://rexschool.com/login',
      },
      channels,
    });
  }

  /**
   * Send a password reset notification
   * @param userId User ID
   * @param email User email
   * @param phoneNumber User phone number
   * @param name User name
   * @param resetToken Reset token
   * @param channels Notification channels
   * @returns Results of the notification sending
   */
  async sendPasswordResetNotification(
    userId: string,
    email: string,
    phoneNumber: string,
    name: string,
    resetToken: string,
    channels?: NotificationChannel[],
  ): Promise<any> {
    return this.sendNotification({
      userId,
      email,
      phoneNumber,
      name,
      type: NotificationType.PASSWORD_RESET,
      context: {
        resetToken,
        resetUrl: `https://rexschool.com/reset-password?token=${resetToken}`,
      },
      channels,
    });
  }

  /**
   * Send a document upload notification
   * @param userId User ID
   * @param email User email
   * @param phoneNumber User phone number
   * @param name User name
   * @param documentTitle Document title
   * @param studentName Student name
   * @param documentUrl Document URL
   * @param channels Notification channels
   * @returns Results of the notification sending
   */
  async sendDocumentUploadNotification(
    userId: string,
    email: string,
    phoneNumber: string,
    name: string,
    documentTitle: string,
    studentName: string,
    documentUrl?: string,
    channels?: NotificationChannel[],
  ): Promise<any> {
    return this.sendNotification({
      userId,
      email,
      phoneNumber,
      name,
      type: NotificationType.DOCUMENT_UPLOAD,
      context: {
        documentTitle,
        studentName,
        documentUrl,
      },
      channels,
    });
  }

  /**
   * Send a document verification notification
   * @param userId User ID
   * @param email User email
   * @param phoneNumber User phone number
   * @param name User name
   * @param documentTitle Document title
   * @param verificationStatus Verification status
   * @param verificationNotes Verification notes
   * @param channels Notification channels
   * @returns Results of the notification sending
   */
  async sendDocumentVerificationNotification(
    userId: string,
    email: string,
    phoneNumber: string,
    name: string,
    documentTitle: string,
    verificationStatus: boolean,
    verificationNotes?: string,
    channels?: NotificationChannel[],
  ): Promise<any> {
    return this.sendNotification({
      userId,
      email,
      phoneNumber,
      name,
      type: NotificationType.DOCUMENT_VERIFICATION,
      context: {
        documentTitle,
        verificationStatus,
        verificationNotes,
      },
      channels,
    });
  }

  /**
   * Send a bulk notification
   * @param recipients Array of recipient objects
   * @param type Notification type
   * @param context Additional context
   * @param channels Notification channels
   * @returns Results of the notification sending
   */
  async sendBulkNotification(
    recipients: Array<{
      userId?: string;
      email?: string;
      phoneNumber?: string;
      name?: string;
      context?: Record<string, any>;
    }>,
    type: NotificationType,
    context?: Record<string, any>,
    channels?: NotificationChannel[],
  ): Promise<any[]> {
    const sendPromises = recipients.map(recipient => 
      this.sendNotification({
        userId: recipient.userId,
        email: recipient.email,
        phoneNumber: recipient.phoneNumber,
        name: recipient.name,
        type,
        context: {
          ...context,
          ...recipient.context,
        },
        channels,
      })
    );

    return Promise.all(sendPromises);
  }
}

