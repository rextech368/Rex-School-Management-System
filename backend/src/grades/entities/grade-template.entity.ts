import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { GradeScale } from '../enums/grade-scale.enum';

@Entity('grade_templates')
export class GradeTemplate extends BaseEntity {
  @ApiProperty({ description: 'Name of the grade template' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Description of the grade template', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Grade scale used for this template', enum: GradeScale })
  @Column({
    type: 'enum',
    enum: GradeScale,
    default: GradeScale.PERCENTAGE,
  })
  gradeScale: GradeScale;

  @ApiProperty({ description: 'JSON structure defining grade categories and weights' })
  @Column({ type: 'jsonb' })
  categories: Record<string, any>;

  @ApiProperty({ description: 'JSON structure defining grade thresholds for letter grades' })
  @Column({ type: 'jsonb', nullable: true })
  letterGradeThresholds?: Record<string, number>;

  @ApiProperty({ description: 'JSON structure defining custom grade scales if applicable' })
  @Column({ type: 'jsonb', nullable: true })
  customScales?: Record<string, any>;

  @ApiProperty({ description: 'Whether this is a system default template' })
  @Column({ default: false })
  isSystemDefault: boolean;

  @ApiProperty({ description: 'School or organization ID this template belongs to', required: false })
  @Column({ type: 'uuid', nullable: true })
  schoolId?: string;

  @ApiProperty({ description: 'User ID who created this template' })
  @Column({ type: 'uuid' })
  createdBy: string;
}

