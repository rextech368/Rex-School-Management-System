import { Entity, Column, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Parent } from './parent.entity';

@Entity('parent_preferences')
export class ParentPreferences extends BaseEntity {
  @ApiProperty({ description: 'Language preference' })
  @Column({ default: 'en' })
  language: string;

  @ApiProperty({ description: 'Receive attendance notifications' })
  @Column({ default: true })
  attendanceNotifications: boolean;

  @ApiProperty({ description: 'Receive grade notifications' })
  @Column({ default: true })
  gradeNotifications: boolean;

  @ApiProperty({ description: 'Receive behavior notifications' })
  @Column({ default: true })
  behaviorNotifications: boolean;

  @ApiProperty({ description: 'Receive fee notifications' })
  @Column({ default: true })
  feeNotifications: boolean;

  @ApiProperty({ description: 'Receive event notifications' })
  @Column({ default: true })
  eventNotifications: boolean;

  @ApiProperty({ description: 'Receive assignment notifications' })
  @Column({ default: true })
  assignmentNotifications: boolean;

  @ApiProperty({ description: 'Notification time preference (24h format, e.g. 18:00)' })
  @Column({ default: '18:00' })
  notificationTimePreference: string;

  @ApiProperty({ description: 'Weekend notifications enabled' })
  @Column({ default: false })
  weekendNotificationsEnabled: boolean;

  @ApiProperty({ description: 'Notification frequency' })
  @Column({ default: 'daily' })
  notificationFrequency: 'immediate' | 'daily' | 'weekly';

  @ApiProperty({ description: 'Dashboard view preference' })
  @Column({ default: 'summary' })
  dashboardViewPreference: 'summary' | 'detailed' | 'calendar';

  @ApiProperty({ description: 'Parent associated with these preferences' })
  @OneToOne(() => Parent, parent => parent.preferences)
  parent: Parent;
}

