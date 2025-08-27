import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { AcademicYear } from './academic-year.entity';

@Entity('terms')
export class Term extends BaseEntity {
  @ApiProperty({ description: 'Term name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Term start date' })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({ description: 'Term end date' })
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({ description: 'Term description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Is current term' })
  @Column({ default: false })
  isCurrent: boolean;

  @ApiProperty({ description: 'Term status' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: 'Academic year ID' })
  @Column({ type: 'uuid' })
  academicYearId: string;

  @ApiProperty({ description: 'Academic year' })
  @ManyToOne(() => AcademicYear, academicYear => academicYear.terms)
  @JoinColumn({ name: 'academicYearId' })
  academicYear: AcademicYear;
}

