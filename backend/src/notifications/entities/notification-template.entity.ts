import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { NotificationType } from '../enums/notification-type.enum';

@Entity('notification_templates')
export class NotificationTemplate extends BaseEntity {
  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @Column({
    type: 'enum',
    enum: NotificationType,
    unique: true,
  })
  type: NotificationType;

  @ApiProperty({ description: 'Template name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Template description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Email subject' })
  @Column({ nullable: true })
  emailSubject?: string;

  @ApiProperty({ description: 'Email template name' })
  @Column({ nullable: true })
  emailTemplate?: string;

  @ApiProperty({ description: 'SMS template name' })
  @Column({ nullable: true })
  smsTemplate?: string;

  @ApiProperty({ description: 'WhatsApp template name' })
  @Column({ nullable: true })
  whatsappTemplate?: string;

  @ApiProperty({ description: 'Push notification title' })
  @Column({ nullable: true })
  pushTitle?: string;

  @ApiProperty({ description: 'Push notification body template' })
  @Column({ nullable: true })
  pushBody?: string;

  @ApiProperty({ description: 'Is template active' })
  @Column({ default: true })
  isActive: boolean;
}

