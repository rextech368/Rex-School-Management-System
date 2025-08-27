import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Parent } from './parent.entity';

@Entity('parent_preferences')
export class ParentPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  smsNotifications: boolean;

  @Column({ default: true })
  whatsappNotifications: boolean;

  @Column({ default: true })
  inAppNotifications: boolean;

  @Column({ default: true })
  attendanceNotifications: boolean;

  @Column({ default: true })
  academicNotifications: boolean;

  @Column({ default: true })
  behaviorNotifications: boolean;

  @Column({ default: true })
  financialNotifications: boolean;

  @Column({ default: true })
  eventNotifications: boolean;

  @Column({ default: true })
  emergencyNotifications: boolean;

  @Column({ default: 'en' })
  preferredLanguage: string;

  @Column({ default: 'email' })
  preferredCommunicationChannel: string;

  @Column({ nullable: true })
  notificationFrequency: string;

  @Column({ nullable: true })
  quietHoursStart: string;

  @Column({ nullable: true })
  quietHoursEnd: string;

  @Column({ default: false })
  receiveMarketingCommunications: boolean;

  @Column({ default: true })
  receiveNewsletters: boolean;

  @Column({ nullable: true })
  additionalPreferences: string;

  @OneToOne(() => Parent, parent => parent.preferences)
  parent: Parent;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  deletedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

