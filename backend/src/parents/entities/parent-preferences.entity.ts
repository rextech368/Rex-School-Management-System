import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Parent } from './parent.entity';

@Entity({ name: 'parent_notification_preferences' })
export class ParentNotificationPreferences {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Parent)
  parent: Parent;

  @Column({ default: true })
  email: boolean;

  @Column({ default: false })
  sms: boolean;

  @Column({ default: false })
  whatsapp: boolean;
}