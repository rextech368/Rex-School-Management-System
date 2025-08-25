import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity({ name: 'report_card_email_messages' })
export class EmailMessage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Student, { nullable: false })
  student: Student;

  @Column()
  exam_id: number;

  @Column()
  class_id: number;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string; // HTML or template string

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}