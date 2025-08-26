import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Class } from '../../classes/entities/class.entity';
import { Section } from '../../classes/entities/section.entity';
import { User } from '../../users/entities/user.entity';
import { AttendanceRecord, AttendanceType } from './attendance-record.entity';

export enum AttendanceSessionStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  VERIFIED = 'verified',
  CANCELLED = 'cancelled',
}

@Entity('attendance_sessions')
export class AttendanceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  classId: string;

  @ManyToOne(() => Class, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  sectionId: string;

  @ManyToOne(() => Section, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'sectionId' })
  section: Section;

  @Column({ type: 'date' })
  @Index()
  date: Date;

  @Column({
    type: 'enum',
    enum: AttendanceType,
    default: AttendanceType.DAILY,
  })
  type: AttendanceType;

  @Column({ type: 'uuid', nullable: true })
  subjectId: string;

  @Column({ type: 'uuid', nullable: true })
  eventId: string;

  @Column({
    type: 'enum',
    enum: AttendanceSessionStatus,
    default: AttendanceSessionStatus.DRAFT,
  })
  status: AttendanceSessionStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'int', default: 0 })
  totalStudents: number;

  @Column({ type: 'int', default: 0 })
  presentCount: number;

  @Column({ type: 'int', default: 0 })
  absentCount: number;

  @Column({ type: 'int', default: 0 })
  lateCount: number;

  @Column({ type: 'int', default: 0 })
  excusedCount: number;

  @Column({ type: 'int', default: 0 })
  halfDayCount: number;

  @OneToMany(() => AttendanceRecord, (record) => record.classId, {
    cascade: true,
  })
  attendanceRecords: AttendanceRecord[];

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'updatedBy' })
  updater: User;

  @Column({ type: 'uuid', nullable: true })
  deletedBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}

