import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AcademicYear } from './academic-year.entity';

@Entity({ name: 'terms' })
export class Term {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => AcademicYear, (year) => year.terms)
  academic_year: AcademicYear;

  @Column()
  name: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ default: 2 })
  sequence_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}