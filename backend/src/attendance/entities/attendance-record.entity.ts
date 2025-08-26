import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Class } from '../../classes/entities/class.entity';
import { Section } from '../../classes/entities/section.entity';
import { User } from '../../users/entities/user.entity';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
  HALF_DAY = 'half_day',
}

export enum AttendanceType {
  DAILY = 'daily',
  SUBJECT = 'subject',
  EVENT = 'event',
}

@Entity('attendance_records')
@Index(['studentId', 'date', 'type'], { unique: true })
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

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
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

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

  @Column({ type: 'time', nullable: true })
  timeIn: Date;

  @Column({ type: 'time', nullable: true })
  timeOut: Date;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'boolean', default: false })
  notified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  notifiedAt: Date;

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

