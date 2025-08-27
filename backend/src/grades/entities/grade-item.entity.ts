import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { GradeType } from '../enums/grade-type.enum';
import { GradeScale } from '../enums/grade-scale.enum';
import { GradeEntry } from './grade-entry.entity';

@Entity('grade_items')
export class GradeItem extends BaseEntity {
  @ApiProperty({ description: 'Title of the grade item' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Description of the grade item', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Type of grade item', enum: GradeType })
  @Column({
    type: 'enum',
    enum: GradeType,
    default: GradeType.ASSIGNMENT,
  })
  type: GradeType;

  @ApiProperty({ description: 'Date the grade item was assigned' })
  @Column({ type: 'date' })
  assignedDate: Date;

  @ApiProperty({ description: 'Due date for the grade item', required: false })
  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @ApiProperty({ description: 'Maximum possible score' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  maxScore: number;

  @ApiProperty({ description: 'Weight of this grade item in the overall grade calculation' })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  weight: number;

  @ApiProperty({ description: 'Grade scale used for this item', enum: GradeScale })
  @Column({
    type: 'enum',
    enum: GradeScale,
    default: GradeScale.PERCENTAGE,
  })
  gradeScale: GradeScale;

  @ApiProperty({ description: 'Whether the grade item is published to students/guardians' })
  @Column({ default: false })
  isPublished: boolean;

  @ApiProperty({ description: 'Class or course ID' })
  @Column({ type: 'uuid' })
  classId: string;

  @ApiProperty({ description: 'Subject or course ID', required: false })
  @Column({ type: 'uuid', nullable: true })
  subjectId?: string;

  @ApiProperty({ description: 'Teacher or creator ID' })
  @Column({ type: 'uuid' })
  createdBy: string;

  @ApiProperty({ description: 'Grade entries for this item', type: [GradeEntry] })
  @OneToMany(() => GradeEntry, (entry) => entry.gradeItem)
  entries: GradeEntry[];
}

