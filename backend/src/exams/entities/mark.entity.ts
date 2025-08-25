import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Exam } from './exam.entity';
import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../academics/entities/subject.entity';

@Entity('marks')
export class Mark extends BaseEntity {
  @ApiProperty({ description: 'Marks obtained' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  marksObtained: number;

  @ApiProperty({ description: 'Grade' })
  @Column({ nullable: true })
  grade?: string;

  @ApiProperty({ description: 'Remarks' })
  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @ApiProperty({ description: 'Exam ID' })
  @Column({ type: 'uuid' })
  examId: string;

  @ApiProperty({ description: 'Exam' })
  @ManyToOne(() => Exam, exam => exam.marks)
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @ApiProperty({ description: 'Student ID' })
  @Column({ type: 'uuid' })
  studentId: string;

  @ApiProperty({ description: 'Student' })
  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ApiProperty({ description: 'Subject ID' })
  @Column({ type: 'uuid' })
  subjectId: string;

  @ApiProperty({ description: 'Subject' })
  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;
}

