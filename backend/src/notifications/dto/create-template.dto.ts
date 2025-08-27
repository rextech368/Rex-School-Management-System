import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../enums/notification-type.enum';

export class CreateTemplateDto {
  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Email subject', required: false })
  @IsOptional()
  @IsString()
  emailSubject?: string;

  @ApiProperty({ description: 'Email template name', required: false })
  @IsOptional()
  @IsString()
  emailTemplate?: string;

  @ApiProperty({ description: 'SMS template name', required: false })
  @IsOptional()
  @IsString()
  smsTemplate?: string;

  @ApiProperty({ description: 'WhatsApp template name', required: false })
  @IsOptional()
  @IsString()
  whatsappTemplate?: string;

  @ApiProperty({ description: 'Push notification title', required: false })
  @IsOptional()
  @IsString()
  pushTitle?: string;

  @ApiProperty({ description: 'Push notification body template', required: false })
  @IsOptional()
  @IsString()
  pushBody?: string;

  @ApiProperty({ description: 'Is template active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

