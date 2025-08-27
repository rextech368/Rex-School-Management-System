import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Class } from './class.entity';

@Entity('courses')
export class Course extends BaseEntity {
  @ApiProperty({ description: 'Course code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Course name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Course description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Department or subject area' })
  @Column()
  department: string;

  @ApiProperty({ description: 'Credit hours or units' })
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  credits: number;

  @ApiProperty({ description: 'Minimum grade level required' })
  @Column({ nullable: true })
  minGradeLevel?: string;

  @ApiProperty({ description: 'Maximum grade level allowed' })
  @Column({ nullable: true })
  maxGradeLevel?: string;

  @ApiProperty({ description: 'Prerequisites (comma-separated course codes)' })
  @Column({ nullable: true })
  prerequisites?: string;

  @ApiProperty({ description: 'Corequisites (comma-separated course codes)' })
  @Column({ nullable: true })
  corequisites?: string;

  @ApiProperty({ description: 'Whether the course is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Course syllabus URL' })
  @Column({ nullable: true })
  syllabusUrl?: string;

  @ApiProperty({ description: 'Course materials URL' })
  @Column({ nullable: true })
  materialsUrl?: string;

  @ApiProperty({ description: 'Additional notes' })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Classes offering this course', type: [Class] })
  @OneToMany(() => Class, cls => cls.course)
  classes: Class[];
}

