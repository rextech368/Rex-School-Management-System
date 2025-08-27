import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ParentNotificationLog, NotificationType, NotificationStatus, NotificationCategory } from '../parents/entities/parent-notification-log.entity';
import { Parent } from '../parents/entities/parent.entity';
import { Student } from '../students/entities/student.entity';
import { MtnCameroonSmsService } from './sms/mtn-cameroon.service';
import { OrangeCameroonSmsService } from './sms/orange-cameroon.service';
import { WhatsAppService } from './whatsapp.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly defaultSmsProvider: string;

  constructor(
    @InjectRepository(ParentNotificationLog)
    private readonly logRepo: Repository<ParentNotificationLog>,
    @InjectRepository(Parent)
    private readonly parentRepo: Repository<Parent>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    private readonly mtnSmsService: MtnCameroonSmsService,
    private readonly orangeSmsService: OrangeCameroonSmsService,
    private readonly whatsAppService: WhatsAppService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.defaultSmsProvider = this.configService.get<string>('DEFAULT_SMS_PROVIDER', 'mtn');
  }

  async resendNotification(logId: string) {
    const log = await this.logRepo.findOne({ 
      where: { id: logId }, 
      relations: ['parent', 'student'] 
    });
    
    if (!log) {
      throw new NotFoundException('Notification log not found');
    }
    
    // Increment delivery attempts
    log.deliveryAttempts += 1;
    log.lastDeliveryAttempt = new Date();
    
    // Re-send based on notification type
    let result;
    
    switch (log.notificationType) {
      case NotificationType.EMAIL:
        result = await this.sendEmail(
          log.parent.email,
          log.subject,
          log.message,
          log.parent,
          log.student
        );
        break;
        
      case NotificationType.SMS:
        result = await this.sendSms(
          log.parent.phoneNumber,
          log.message,
          this.defaultSmsProvider
        );
        break;
        
      case NotificationType.WHATSAPP:
        result = await this.whatsAppService.sendWhatsApp(
          log.parent.phoneNumber,
          log.message
        );
        break;
        
      case NotificationType.IN_APP:
        // In-app notifications would be handled differently
        result = { success: true, status: 'sent' };
        break;
        
      default:
        result = { success: false, error: 'Unknown notification type' };
    }
    
    // Update log status based on result
    if (result.success) {
      log.status = NotificationStatus.SENT;
      
      // Store provider-specific message IDs if available
      if (log.notificationType === NotificationType.SMS && result.messageId) {
        log.smsMessageId = result.messageId;
        log.smsDeliveryStatus = result.status;
      } else if (log.notificationType === NotificationType.WHATSAPP && result.messageId) {
        log.whatsappMessageId = result.messageId;
        log.whatsappDeliveryStatus = result.status;
      }
    } else {
      log.status = NotificationStatus.FAILED;
      log.error = result.error;
    }
    
    // Save updated log
    await this.logRepo.save(log);
    
    return { 
      status: log.status,
      deliveryAttempts: log.deliveryAttempts,
      lastDeliveryAttempt: log.lastDeliveryAttempt
    };
  }

  async sendReminderToParent(parentId: string, examId: string) {
    const parent = await this.parentRepo.findOne({ 
      where: { id: parentId },
      relations: ['students']
    });
    
    if (!parent) {
      throw new NotFoundException('Parent not found');
    }
    
    // Get the exam details (assuming there's an exam service/repository)
    // For now, we'll use placeholder data
    const examDetails = {
      id: examId,
      name: 'Mid-Term Examination',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      subjects: ['Mathematics', 'English', 'Science'],
    };
    
    // Create notification message
    const subject = `Reminder: Upcoming ${examDetails.name}`;
    const message = `Dear ${parent.firstName} ${parent.lastName},\n\n` +
      `This is a reminder that the ${examDetails.name} is scheduled to begin on ` +
      `${examDetails.date.toDateString()}.\n\n` +
      `Subjects: ${examDetails.subjects.join(', ')}\n\n` +
      `Please ensure your child is prepared and arrives on time.\n\n` +
      `Regards,\nSchool Administration`;
    
    // Send notifications based on parent preferences
    const notificationLogs = [];
    
    // Send email if enabled
    if (parent.emailNotificationsEnabled) {
      const emailResult = await this.sendEmail(
        parent.email,
        subject,
        message,
        parent,
        null // No specific student for this notification
      );
      
      notificationLogs.push(
        this.createNotificationLog(
          parent,
          null,
          NotificationType.EMAIL,
          emailResult.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
          NotificationCategory.EVENT,
          subject,
          message,
          emailResult.success ? null : emailResult.error
        )
      );
    }
    
    // Send SMS if enabled
    if (parent.smsNotificationsEnabled) {
      const smsResult = await this.sendSms(
        parent.phoneNumber,
        `Reminder: ${examDetails.name} is scheduled for ${examDetails.date.toDateString()}. Please ensure your child is prepared.`,
        this.defaultSmsProvider
      );
      
      const log = this.createNotificationLog(
        parent,
        null,
        NotificationType.SMS,
        smsResult.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
        NotificationCategory.EVENT,
        subject,
        message,
        smsResult.success ? null : smsResult.error
      );
      
      if (smsResult.success) {
        log.smsMessageId = smsResult.messageId;
        log.smsDeliveryStatus = smsResult.status;
      }
      
      notificationLogs.push(log);
    }
    
    // Send WhatsApp if enabled
    if (parent.whatsappNotificationsEnabled) {
      const whatsappResult = await this.whatsAppService.sendWhatsApp(
        parent.phoneNumber,
        `Reminder: ${examDetails.name} is scheduled for ${examDetails.date.toDateString()}. Please ensure your child is prepared.`
      );
      
      const log = this.createNotificationLog(
        parent,
        null,
        NotificationType.WHATSAPP,
        whatsappResult.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
        NotificationCategory.EVENT,
        subject,
        message,
        whatsappResult.success ? null : whatsappResult.error
      );
      
      if (whatsappResult.success) {
        log.whatsappMessageId = whatsappResult.messageId;
        log.whatsappDeliveryStatus = whatsappResult.status;
      }
      
      notificationLogs.push(log);
    }
    
    // Save all notification logs
    await this.logRepo.save(notificationLogs);
    
    return { 
      status: 'reminder_sent',
      channels: notificationLogs.map(log => log.notificationType),
      parent: {
        id: parent.id,
        name: `${parent.firstName} ${parent.lastName}`,
      }
    };
  }

  async notifyParentAboutAttendance(parentId: string, studentId: string, date: Date, status: string) {
    const parent = await this.parentRepo.findOne({ where: { id: parentId } });
    if (!parent) {
      throw new NotFoundException('Parent not found');
    }
    
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    
    // Check if parent has attendance notifications enabled
    if (parent.preferences && !parent.preferences.attendanceNotifications) {
      return { status: 'skipped', reason: 'Attendance notifications disabled by parent' };
    }
    
    // Create notification message
    const subject = `Attendance Update: ${student.firstName} ${student.lastName}`;
    const message = `Dear ${parent.firstName} ${parent.lastName},\n\n` +
      `This is to inform you that ${student.firstName} ${student.lastName} was marked as ` +
      `${status} on ${date.toDateString()}.\n\n` +
      `If you have any questions, please contact the school administration.\n\n` +
      `Regards,\nSchool Administration`;
    
    // Send notifications based on parent preferences
    const notificationLogs = [];
    
    // Send email if enabled
    if (parent.emailNotificationsEnabled) {
      const emailResult = await this.sendEmail(
        parent.email,
        subject,
        message,
        parent,
        student
      );
      
      notificationLogs.push(
        this.createNotificationLog(
          parent,
          student,
          NotificationType.EMAIL,
          emailResult.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
          NotificationCategory.ATTENDANCE,
          subject,
          message,
          emailResult.success ? null : emailResult.error
        )
      );
    }
    
    // Send SMS if enabled
    if (parent.smsNotificationsEnabled) {
      const smsMessage = `Attendance Update: ${student.firstName} ${student.lastName} was marked as ${status} on ${date.toDateString()}.`;
      
      const smsResult = await this.sendSms(
        parent.phoneNumber,
        smsMessage,
        this.defaultSmsProvider
      );
      
      const log = this.createNotificationLog(
        parent,
        student,
        NotificationType.SMS,
        smsResult.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
        NotificationCategory.ATTENDANCE,
        subject,
        smsMessage,
        smsResult.success ? null : smsResult.error
      );
      
      if (smsResult.success) {
        log.smsMessageId = smsResult.messageId;
        log.smsDeliveryStatus = smsResult.status;
      }
      
      notificationLogs.push(log);
    }
    
    // Send WhatsApp if enabled
    if (parent.whatsappNotificationsEnabled) {
      const whatsappMessage = `Attendance Update: ${student.firstName} ${student.lastName} was marked as ${status} on ${date.toDateString()}.`;
      
      const whatsappResult = await this.whatsAppService.sendWhatsApp(
        parent.phoneNumber,
        whatsappMessage
      );
      
      const log = this.createNotificationLog(
        parent,
        student,
        NotificationType.WHATSAPP,
        whatsappResult.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
        NotificationCategory.ATTENDANCE,
        subject,
        whatsappMessage,
        whatsappResult.success ? null : whatsappResult.error
      );
      
      if (whatsappResult.success) {
        log.whatsappMessageId = whatsappResult.messageId;
        log.whatsappDeliveryStatus = whatsappResult.status;
      }
      
      notificationLogs.push(log);
    }
    
    // Save all notification logs
    await this.logRepo.save(notificationLogs);
    
    return { 
      status: 'notification_sent',
      channels: notificationLogs.map(log => log.notificationType),
      parent: {
        id: parent.id,
        name: `${parent.firstName} ${parent.lastName}`,
      },
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
      }
    };
  }

  private async sendEmail(to: string, subject: string, body: string, parent: Parent, student: Student | null): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: to,
        subject: subject,
        text: body,
        // You can also use HTML template
        // template: 'notification',
        // context: {
        //   parent: parent,
        //   student: student,
        //   message: body,
        // },
      });
      
      this.logger.log(`Email sent to ${to}`);
      
      return {
        success: true,
        status: 'sent',
      };
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private async sendSms(to: string, message: string, provider: string = 'mtn'): Promise<any> {
    try {
      let result;
      
      if (provider.toLowerCase() === 'orange') {
        result = await this.orangeSmsService.sendSms(to, message);
      } else {
        // Default to MTN
        result = await this.mtnSmsService.sendSms(to, message);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`, error.stack);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private createNotificationLog(
    parent: Parent,
    student: Student | null,
    notificationType: NotificationType,
    status: NotificationStatus,
    category: NotificationCategory,
    subject: string,
    message: string,
    error: string | null = null
  ): ParentNotificationLog {
    const log = new ParentNotificationLog();
    log.parent = parent;
    log.parentId = parent.id;
    
    if (student) {
      log.student = student;
      log.studentId = student.id;
    }
    
    log.notificationType = notificationType;
    log.status = status;
    log.category = category;
    log.subject = subject;
    log.message = message;
    log.error = error;
    log.deliveryAttempts = 1;
    log.lastDeliveryAttempt = new Date();
    
    return log;
  }
}

