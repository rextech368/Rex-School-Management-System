import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Gender } from '../enums/gender.enum';
import { StudentStatus } from '../enums/student-status.enum';
import { Guardian } from './guardian.entity';
import { User } from '../../users/entities/user.entity';

@Entity('students')
export class Student extends BaseEntity {
  @ApiProperty({ description: 'First name of the student' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Middle name of the student', required: false })
  @Column({ nullable: true })
  middleName?: string;

  @ApiProperty({ description: 'Last name of the student' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'Date of birth of the student' })
  @Column({ type: 'date' })
  dateOfBirth: Date;

  @ApiProperty({ description: 'Gender of the student', enum: Gender })
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.PREFER_NOT_TO_SAY,
  })
  gender: Gender;

  @ApiProperty({ description: 'Email address of the student', required: false })
  @Column({ nullable: true, unique: true })
  email?: string;

  @ApiProperty({ description: 'Phone number of the student', required: false })
  @Column({ nullable: true })
  phoneNumber?: string;

  @ApiProperty({ description: 'Address of the student', required: false })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiProperty({ description: 'City of residence', required: false })
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({ description: 'State/province of residence', required: false })
  @Column({ nullable: true })
  state?: string;

  @ApiProperty({ description: 'Postal/ZIP code', required: false })
  @Column({ nullable: true })
  postalCode?: string;

  @ApiProperty({ description: 'Country of residence', required: false })
  @Column({ nullable: true })
  country?: string;

  @ApiProperty({ description: 'Nationality of the student', required: false })
  @Column({ nullable: true })
  nationality?: string;

  @ApiProperty({ description: 'Student ID number (school-specific)' })
  @Column({ unique: true })
  studentId: string;

  @ApiProperty({ description: 'Grade level or year of study' })
  @Column()
  gradeLevel: string;

  @ApiProperty({ description: 'Class or section ID', required: false })
  @Column({ nullable: true })
  classId?: string;

  @ApiProperty({ description: 'Enrollment date' })
  @Column({ type: 'date' })
  enrollmentDate: Date;

  @ApiProperty({ description: 'Graduation date', required: false })
  @Column({ type: 'date', nullable: true })
  graduationDate?: Date;

  @ApiProperty({ description: 'Status of the student', enum: StudentStatus })
  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status: StudentStatus;

  @ApiProperty({ description: 'Emergency contact name', required: false })
  @Column({ nullable: true })
  emergencyContactName?: string;

  @ApiProperty({ description: 'Emergency contact phone', required: false })
  @Column({ nullable: true })
  emergencyContactPhone?: string;

  @ApiProperty({ description: 'Emergency contact relationship', required: false })
  @Column({ nullable: true })
  emergencyContactRelationship?: string;

  @ApiProperty({ description: 'Medical information or notes', required: false })
  @Column({ type: 'text', nullable: true })
  medicalInformation?: string;

  @ApiProperty({ description: 'Special needs or accommodations', required: false })
  @Column({ type: 'text', nullable: true })
  specialNeeds?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Profile photo URL', required: false })
  @Column({ nullable: true })
  profilePhotoUrl?: string;

  @ApiProperty({ description: 'User ID if student has system access', required: false })
  @Column({ nullable: true })
  userId?: string;

  @ApiProperty({ description: 'User account if student has system access', required: false })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ApiProperty({ description: 'Guardians associated with this student', type: [Guardian] })
  @ManyToMany(() => Guardian, guardian => guardian.students)
  @JoinTable({
    name: 'student_guardians',
    joinColumn: { name: 'studentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'guardianId', referencedColumnName: 'id' },
  })
  guardians: Guardian[];
}

