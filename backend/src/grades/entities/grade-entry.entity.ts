import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { GradeItem } from './grade-item.entity';
import { Student } from '../../students/entities/student.entity';

@Entity('grade_entries')
export class GradeEntry extends BaseEntity {
  @ApiProperty({ description: 'Grade item ID' })
  @Column({ type: 'uuid' })
  gradeItemId: string;

  @ApiProperty({ description: 'Grade item', type: () => GradeItem })
  @ManyToOne(() => GradeItem, (item) => item.entries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gradeItemId' })
  gradeItem: GradeItem;

  @ApiProperty({ description: 'Student ID' })
  @Column({ type: 'uuid' })
  studentId: string;

  @ApiProperty({ description: 'Student', type: () => Student })
  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ApiProperty({ description: 'Score achieved by the student' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  score: number;

  @ApiProperty({ description: 'Letter grade (if applicable)', required: false })
  @Column({ nullable: true })
  letterGrade?: string;

  @ApiProperty({ description: 'Feedback or comments on the grade', required: false })
  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @ApiProperty({ description: 'Whether the grade has been submitted' })
  @Column({ default: false })
  isSubmitted: boolean;

  @ApiProperty({ description: 'Date when the grade was submitted', required: false })
  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @ApiProperty({ description: 'Whether the student was exempt from this grade item' })
  @Column({ default: false })
  isExempt: boolean;

  @ApiProperty({ description: 'Reason for exemption', required: false })
  @Column({ type: 'text', nullable: true })
  exemptReason?: string;

  @ApiProperty({ description: 'Whether the grade has been modified after initial submission' })
  @Column({ default: false })
  isModified: boolean;

  @ApiProperty({ description: 'User ID of who last modified the grade', required: false })
  @Column({ type: 'uuid', nullable: true })
  modifiedBy?: string;

  @ApiProperty({ description: 'Whether notification was sent to student/guardian' })
  @Column({ default: false })
  notificationSent: boolean;
}

