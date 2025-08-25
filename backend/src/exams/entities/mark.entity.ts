import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Exam } from './exam.entity';
import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../academics/entities/subject.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'marks' })
@Unique(['exam', 'student', 'subject'])
export class Mark {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Exam, { nullable: false })
  exam: Exam;

  @ManyToOne(() => Student, { nullable: false })
  student: Student;

  @ManyToOne(() => Subject, { nullable: false })
  subject: Subject;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @ManyToOne(() => User, { nullable: false })
  entered_by: User;

  @CreateDateColumn()
  entered_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}