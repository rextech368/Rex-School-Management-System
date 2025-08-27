import { IsArray, IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationChannel } from '../enums/notification-channel.enum';
import { SendNotificationDto } from './send-notification.dto';

export class SendBulkNotificationDto {
  @ApiProperty({ description: 'Recipients', type: [SendNotificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SendNotificationDto)
  recipients: SendNotificationDto[];

  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Shared context for all recipients', required: false })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;

  @ApiProperty({ description: 'Notification channels', enum: NotificationChannel, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels?: NotificationChannel[];
}

