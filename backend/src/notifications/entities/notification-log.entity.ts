import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationChannel } from '../enums/notification-channel.enum';

@Entity('notification_logs')
export class NotificationLog extends BaseEntity {
  @ApiProperty({ description: 'User ID', required: false })
  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @ApiProperty({ description: 'Notification channel', enum: NotificationChannel })
  @Column({
    type: 'enum',
    enum: NotificationChannel,
  })
  channel: NotificationChannel;

  @ApiProperty({ description: 'Recipient (email or phone number)' })
  @Column()
  recipient: string;

  @ApiProperty({ description: 'Was notification successful' })
  @Column({ default: true })
  success: boolean;

  @ApiProperty({ description: 'Error message if notification failed', required: false })
  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @ApiProperty({ description: 'Notification data', required: false })
  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, any>;
}

