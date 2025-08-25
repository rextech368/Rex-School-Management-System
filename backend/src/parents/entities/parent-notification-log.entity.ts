import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Parent } from './parent.entity';
import { Student } from '../../students/entities/student.entity';

@Entity({ name: 'parent_notification_logs' })
export class ParentNotificationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Parent)
  parent: Parent;

  @ManyToOne(() => Student)
  student: Student;

  @Column()
  notification_type: 'email' | 'sms' | 'whatsapp' | 'in-app';

  @Column()
  status: 'sent' | 'delivered' | 'failed' | 'opened' | 'clicked';

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  error: string;

  @Column({ nullable: true })
  opened_at: Date;

  @Column({ nullable: true })
  clicked_at: Date;

  @Column({ nullable: true })
  sms_delivery_status: string;

  @CreateDateColumn()
  created_at: Date;
}