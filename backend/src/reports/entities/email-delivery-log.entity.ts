import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity({ name: 'report_card_email_logs' })
export class EmailDeliveryLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Student, { nullable: false })
  student: Student;

  @Column()
  email: string;

  @Column()
  exam_id: number;

  @Column()
  class_id: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed';

  @Column({ nullable: true })
  error_message: string;

  @Column({ default: 0 })
  retry_count: number;

  @Column({ nullable: true })
  last_attempt_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}