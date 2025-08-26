import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Course } from './course.entity';
import { ClassType } from '../enums/class-type.enum';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
import { ClassSchedule } from './class-schedule.entity';
import { Term } from './term.entity';

@Entity('classes')
export class Class extends BaseEntity {
  @ApiProperty({ description: 'Class name or section' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Class code (unique identifier)' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Course ID' })
  @Column({ type: 'uuid' })
  courseId: string;

  @ApiProperty({ description: 'Course', type: () => Course })
  @ManyToOne(() => Course, course => course.classes)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ApiProperty({ description: 'Term ID' })
  @Column({ type: 'uuid' })
  termId: string;

  @ApiProperty({ description: 'Term', type: () => Term })
  @ManyToOne(() => Term, term => term.classes)
  @JoinColumn({ name: 'termId' })
  term: Term;

  @ApiProperty({ description: 'Class type', enum: ClassType })
  @Column({
    type: 'enum',
    enum: ClassType,
    default: ClassType.REGULAR,
  })
  type: ClassType;

  @ApiProperty({ description: 'Maximum enrollment capacity' })
  @Column({ type: 'integer' })
  capacity: number;

  @ApiProperty({ description: 'Current enrollment count' })
  @Column({ type: 'integer', default: 0 })
  enrollmentCount: number;

  @ApiProperty({ description: 'Room or location' })
  @Column({ nullable: true })
  room?: string;

  @ApiProperty({ description: 'Building' })
  @Column({ nullable: true })
  building?: string;

  @ApiProperty({ description: 'Primary teacher ID' })
  @Column({ type: 'uuid', nullable: true })
  primaryTeacherId?: string;

  @ApiProperty({ description: 'Primary teacher', type: () => User })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'primaryTeacherId' })
  primaryTeacher?: User;

  @ApiProperty({ description: 'Whether the class is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Syllabus URL (overrides course syllabus)' })
  @Column({ nullable: true })
  syllabusUrl?: string;

  @ApiProperty({ description: 'Additional notes' })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Class schedules', type: [ClassSchedule] })
  @OneToMany(() => ClassSchedule, schedule => schedule.class)
  schedules: ClassSchedule[];

  @ApiProperty({ description: 'Students enrolled in this class', type: [Student] })
  @ManyToMany(() => Student)
  @JoinTable({
    name: 'class_enrollments',
    joinColumn: { name: 'classId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'studentId', referencedColumnName: 'id' },
  })
  students: Student[];

  @ApiProperty({ description: 'Assistant teachers', type: [User] })
  @ManyToMany(() => User)
  @JoinTable({
    name: 'class_assistant_teachers',
    joinColumn: { name: 'classId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'teacherId', referencedColumnName: 'id' },
  })
  assistantTeachers: User[];
}

