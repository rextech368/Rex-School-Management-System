import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Student } from '../../students/entities/student.entity';
import { AttendanceStatus } from '../enums/attendance-status.enum';

@Entity('attendance_records')
export class AttendanceRecord extends BaseEntity {
  @ApiProperty({ description: 'Student ID' })
  @Column({ type: 'uuid' })
  studentId: string;

  @ApiProperty({ description: 'Student', type: () => Student })
  @ManyToOne(() => Student, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ApiProperty({ description: 'Date of attendance record' })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ description: 'Attendance status', enum: AttendanceStatus })
  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @ApiProperty({ description: 'Time in (for partial attendance)', required: false })
  @Column({ type: 'time', nullable: true })
  timeIn?: Date;

  @ApiProperty({ description: 'Time out (for partial attendance)', required: false })
  @Column({ type: 'time', nullable: true })
  timeOut?: Date;

  @ApiProperty({ description: 'Notes about the attendance', required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Reason for absence/late arrival', required: false })
  @Column({ type: 'text', nullable: true })
  reason?: string;

  @ApiProperty({ description: 'Whether the absence is excused', required: false })
  @Column({ default: false })
  isExcused: boolean;

  @ApiProperty({ description: 'Whether notification was sent', required: false })
  @Column({ default: false })
  notificationSent: boolean;

  @ApiProperty({ description: 'Class or session ID', required: false })
  @Column({ type: 'uuid', nullable: true })
  classId?: string;

  @ApiProperty({ description: 'Recorded by user ID' })
  @Column({ type: 'uuid' })
  recordedBy: string;
}

