import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Class } from '../../academics/entities/class.entity';
import { Section } from '../../academics/entities/section.entity';
import { AcademicYear } from '../../academics/entities/academic-year.entity';

@Entity({ name: 'students' })
export class Student {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ type: 'date' })
  dob: string;

  @Column({ type: 'varchar', length: 10 })
  gender: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  guardian_name: string;

  @Column({ nullable: true })
  guardian_phone: string;

  @Column({ type: 'date' })
  admission_date: string;

  @ManyToOne(() => Class, { nullable: true })
  current_class: Class;

  @ManyToOne(() => Section, { nullable: true })
  current_section: Section;

  @ManyToOne(() => AcademicYear, { nullable: true })
  academic_year: AcademicYear;

  @Column({ default: 0 })
  repeat_count: number;

  @Column({ default: 0 })
  stars: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}