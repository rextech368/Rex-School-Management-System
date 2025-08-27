import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Term } from '../../academics/entities/term.entity';
import { Mark } from './mark.entity';

export enum ExamType {
  QUIZ = 'quiz',
  TEST = 'test',
  MIDTERM = 'midterm',
  FINAL = 'final',
  ASSIGNMENT = 'assignment',
  PROJECT = 'project',
}

@Entity('exams')
export class Exam extends BaseEntity {
  @ApiProperty({ description: 'Exam name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Exam description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Exam type', enum: ExamType })
  @Column({ type: 'enum', enum: ExamType, default: ExamType.TEST })
  type: ExamType;

  @ApiProperty({ description: 'Exam start date' })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({ description: 'Exam end date' })
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({ description: 'Maximum marks' })
  @Column({ default: 100 })
  maxMarks: number;

  @ApiProperty({ description: 'Pass marks' })
  @Column({ default: 40 })
  passMarks: number;

  @ApiProperty({ description: 'Exam status' })
  @Column({ default: 'pending' })
  status: string;

  @ApiProperty({ description: 'Term ID' })
  @Column({ type: 'uuid' })
  termId: string;

  @ApiProperty({ description: 'Term' })
  @ManyToOne(() => Term)
  @JoinColumn({ name: 'termId' })
  term: Term;

  @ApiProperty({ description: 'Marks for this exam' })
  @OneToMany(() => Mark, mark => mark.exam)
  marks: Mark[];
}

