import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Parent } from './parent.entity';
import { Student } from '../../students/entities/student.entity';

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  IN_APP = 'in_app',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  OPENED = 'opened',
  CLICKED = 'clicked',
}

export enum NotificationCategory {
  ATTENDANCE = 'attendance',
  GRADE = 'grade',
  BEHAVIOR = 'behavior',
  FEE = 'fee',
  EVENT = 'event',
  ASSIGNMENT = 'assignment',
  GENERAL = 'general',
}

@Entity('parent_notification_logs')
export class ParentNotificationLog extends BaseEntity {
  @ApiProperty({ description: 'Parent who received the notification' })
  @ManyToOne(() => Parent, parent => parent.notificationLogs)
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @Column({ type: 'uuid' })
  parentId: string;

  @ApiProperty({ description: 'Student related to the notification' })
  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'uuid', nullable: true })
  studentId?: string;

  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @Column({ type: 'enum', enum: NotificationType })
  notificationType: NotificationType;

  @ApiProperty({ description: 'Notification status', enum: NotificationStatus })
  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @ApiProperty({ description: 'Notification category', enum: NotificationCategory })
  @Column({ type: 'enum', enum: NotificationCategory, default: NotificationCategory.GENERAL })
  category: NotificationCategory;

  @ApiProperty({ description: 'Notification subject' })
  @Column()
  subject: string;

  @ApiProperty({ description: 'Notification message' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ description: 'Error message if notification failed' })
  @Column({ type: 'text', nullable: true })
  error?: string;

  @ApiProperty({ description: 'When the notification was opened' })
  @Column({ type: 'timestamp', nullable: true })
  openedAt?: Date;

  @ApiProperty({ description: 'When the notification was clicked' })
  @Column({ type: 'timestamp', nullable: true })
  clickedAt?: Date;

  @ApiProperty({ description: 'SMS delivery status from provider' })
  @Column({ nullable: true })
  smsDeliveryStatus?: string;

  @ApiProperty({ description: 'SMS provider message ID' })
  @Column({ nullable: true })
  smsMessageId?: string;

  @ApiProperty({ description: 'WhatsApp delivery status from provider' })
  @Column({ nullable: true })
  whatsappDeliveryStatus?: string;

  @ApiProperty({ description: 'WhatsApp provider message ID' })
  @Column({ nullable: true })
  whatsappMessageId?: string;

  @ApiProperty({ description: 'Number of delivery attempts' })
  @Column({ default: 1 })
  deliveryAttempts: number;

  @ApiProperty({ description: 'Last delivery attempt timestamp' })
  @Column({ type: 'timestamp', nullable: true })
  lastDeliveryAttempt?: Date;
}

