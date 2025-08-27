import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Term } from './term.entity';

@Entity('academic_years')
export class AcademicYear extends BaseEntity {
  @ApiProperty({ description: 'Academic year name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Academic year start date' })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({ description: 'Academic year end date' })
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({ description: 'Academic year description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Is current academic year' })
  @Column({ default: false })
  isCurrent: boolean;

  @ApiProperty({ description: 'Academic year status' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: 'Terms in this academic year' })
  @OneToMany(() => Term, term => term.academicYear)
  terms: Term[];
}

