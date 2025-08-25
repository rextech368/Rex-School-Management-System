import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AcademicYear } from '../../academics/entities/academic-year.entity';
import { Term } from '../../academics/entities/term.entity';

@Entity({ name: 'exams' })
export class Exam {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => AcademicYear, { nullable: false })
  academic_year: AcademicYear;

  @ManyToOne(() => Term, { nullable: false })
  term: Term;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}