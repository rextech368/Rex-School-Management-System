import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { TermType } from '../enums/term-type.enum';
import { Class } from './class.entity';

@Entity('terms')
export class Term extends BaseEntity {
  @ApiProperty({ description: 'Term name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Academic year (e.g., 2024-2025)' })
  @Column()
  academicYear: string;

  @ApiProperty({ description: 'Term type', enum: TermType })
  @Column({
    type: 'enum',
    enum: TermType,
    default: TermType.SEMESTER,
  })
  type: TermType;

  @ApiProperty({ description: 'Start date' })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({ description: 'Whether the term is active' })
  @Column({ default: false })
  isActive: boolean;

  @ApiProperty({ description: 'Whether the term is current' })
  @Column({ default: false })
  isCurrent: boolean;

  @ApiProperty({ description: 'Additional notes' })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Classes in this term', type: [Class] })
  @OneToMany(() => Class, cls => cls.term)
  classes: Class[];
}

