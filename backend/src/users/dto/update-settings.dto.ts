import { ApiProperty } from '@nestjs/swagger';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NotificationSettings {
  @ApiProperty({ description: 'Email notifications enabled', default: true })
  emailEnabled: boolean;

  @ApiProperty({ description: 'In-app notifications enabled', default: true })
  inAppEnabled: boolean;

  @ApiProperty({ description: 'SMS notifications enabled', default: false })
  smsEnabled: boolean;

  @ApiProperty({ description: 'Notification types configuration' })
  types: {
    announcements: boolean;
    grades: boolean;
    attendance: boolean;
    assignments: boolean;
    messages: boolean;
    events: boolean;
  };
}

class DisplaySettings {
  @ApiProperty({ description: 'Theme preference', default: 'light' })
  theme: 'light' | 'dark' | 'system';

  @ApiProperty({ description: 'Language preference', default: 'en' })
  language: string;

  @ApiProperty({ description: 'Time zone', default: 'UTC' })
  timezone: string;

  @ApiProperty({ description: 'Date format', default: 'MM/DD/YYYY' })
  dateFormat: string;

  @ApiProperty({ description: 'Time format', default: '12h' })
  timeFormat: '12h' | '24h';
}

class PrivacySettings {
  @ApiProperty({ description: 'Profile visibility', default: 'school' })
  profileVisibility: 'public' | 'school' | 'private';

  @ApiProperty({ description: 'Show online status', default: true })
  showOnlineStatus: boolean;

  @ApiProperty({ description: 'Allow messages from', default: 'school' })
  allowMessagesFrom: 'everyone' | 'school' | 'none';
}

export class UpdateSettingsDto {
  @ApiProperty({ description: 'Notification settings' })
  @IsObject()
  @ValidateNested()
  @Type(() => NotificationSettings)
  notifications?: NotificationSettings;

  @ApiProperty({ description: 'Display settings' })
  @IsObject()
  @ValidateNested()
  @Type(() => DisplaySettings)
  display?: DisplaySettings;

  @ApiProperty({ description: 'Privacy settings' })
  @IsObject()
  @ValidateNested()
  @Type(() => PrivacySettings)
  privacy?: PrivacySettings;
}

