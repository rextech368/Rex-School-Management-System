import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Class } from './class.entity';
import { DayOfWeek } from '../enums/day-of-week.enum';

@Entity('class_schedules')
export class ClassSchedule extends BaseEntity {
  @ApiProperty({ description: 'Class ID' })
  @Column({ type: 'uuid' })
  classId: string;

  @ApiProperty({ description: 'Class', type: () => Class })
  @ManyToOne(() => Class, cls => cls.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @ApiProperty({ description: 'Day of week', enum: DayOfWeek })
  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @ApiProperty({ description: 'Start time (HH:MM format)' })
  @Column({ type: 'time' })
  startTime: string;

  @ApiProperty({ description: 'End time (HH:MM format)' })
  @Column({ type: 'time' })
  endTime: string;

  @ApiProperty({ description: 'Room (overrides class room)' })
  @Column({ nullable: true })
  room?: string;

  @ApiProperty({ description: 'Building (overrides class building)' })
  @Column({ nullable: true })
  building?: string;

  @ApiProperty({ description: 'Whether this is a recurring schedule' })
  @Column({ default: true })
  isRecurring: boolean;

  @ApiProperty({ description: 'Specific date (for non-recurring schedules)' })
  @Column({ type: 'date', nullable: true })
  specificDate?: Date;

  @ApiProperty({ description: 'Additional notes' })
  @Column({ type: 'text', nullable: true })
  notes?: string;
}

