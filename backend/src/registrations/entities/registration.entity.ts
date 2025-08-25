import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Class } from '../../academics/entities/class.entity';
import { Section } from '../../academics/entities/section.entity';

@Entity({ name: 'registrations' })
export class Registration {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  applicant_name: string;

  @Column({ type: 'date' })
  dob: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => Class, { nullable: false })
  desired_class: Class;

  @ManyToOne(() => Section, { nullable: true })
  desired_section: Section;

  @Column({ type: 'jsonb', nullable: true })
  subjects_selected: any;

  @Column({ nullable: true })
  report_card_url: string;

  @Column({ nullable: true })
  application_letter_url: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';

  @Column({ nullable: true })
  admin_note: string;

  @CreateDateColumn()
  submitted_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}