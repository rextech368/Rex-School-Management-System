import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'report_card_email_templates' })
export class EmailTemplate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  class_id: number;

  @Column()
  exam_id: number;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string; // HTML or template string

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}