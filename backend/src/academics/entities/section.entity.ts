import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Class } from './class.entity';
import { User } from '../../users/entities/user.entity';

@Entity('sections')
export class Section extends BaseEntity {
  @ApiProperty({ description: 'Section name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Section code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Section description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Maximum number of students' })
  @Column({ default: 50 })
  maxStudents: number;

  @ApiProperty({ description: 'Section status' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: 'Class ID' })
  @Column({ type: 'uuid' })
  classId: string;

  @ApiProperty({ description: 'Class' })
  @ManyToOne(() => Class, cls => cls.sections)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @ApiProperty({ description: 'Class teacher ID' })
  @Column({ type: 'uuid', nullable: true })
  classTeacherId?: string;

  @ApiProperty({ description: 'Class teacher' })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'classTeacherId' })
  classTeacher?: User;
}

