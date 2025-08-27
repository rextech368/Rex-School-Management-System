import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Student } from './student.entity';

export enum GroupType {
  CLASS = 'class',
  SECTION = 'section',
  HOUSE = 'house',
  CLUB = 'club',
  TEAM = 'team',
  COMMITTEE = 'committee',
  SPECIAL_INTEREST = 'special_interest',
  ACADEMIC = 'academic',
  OTHER = 'other',
}

@Entity('student_groups')
export class StudentGroup extends BaseEntity {
  @ApiProperty({ description: 'Group name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Group description', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Group type', enum: GroupType })
  @Column({
    type: 'enum',
    enum: GroupType,
    default: GroupType.OTHER,
  })
  type: GroupType;

  @ApiProperty({ description: 'Academic year ID', required: false })
  @Column({ type: 'uuid', nullable: true })
  academicYearId?: string;

  @ApiProperty({ description: 'Group code', required: false })
  @Column({ nullable: true })
  code?: string;

  @ApiProperty({ description: 'Maximum capacity', required: false })
  @Column({ nullable: true })
  maxCapacity?: number;

  @ApiProperty({ description: 'Group color code', required: false })
  @Column({ nullable: true })
  colorCode?: string;

  @ApiProperty({ description: 'Group icon', required: false })
  @Column({ nullable: true })
  icon?: string;

  @ApiProperty({ description: 'Is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Parent group ID', required: false })
  @Column({ type: 'uuid', nullable: true })
  parentGroupId?: string;

  @ApiProperty({ description: 'Group leader ID (teacher/staff)', required: false })
  @Column({ type: 'uuid', nullable: true })
  leaderId?: string;

  @ApiProperty({ description: 'Group assistant leader ID', required: false })
  @Column({ type: 'uuid', nullable: true })
  assistantLeaderId?: string;

  @ApiProperty({ description: 'Meeting schedule', required: false })
  @Column({ nullable: true })
  meetingSchedule?: string;

  @ApiProperty({ description: 'Meeting location', required: false })
  @Column({ nullable: true })
  meetingLocation?: string;

  @ApiProperty({ description: 'Students in this group' })
  @ManyToMany(() => Student)
  @JoinTable({
    name: 'student_group_members',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'student_id', referencedColumnName: 'id' },
  })
  students?: Student[];
}

