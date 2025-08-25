import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

@Entity('students')
export class Student extends BaseEntity {
  @ApiProperty({ description: 'Student admission number' })
  @Column({ unique: true })
  admissionNumber: string;

  @ApiProperty({ description: 'Student first name' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Student last name' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'Student middle name', required: false })
  @Column({ nullable: true })
  middleName?: string;

  @ApiProperty({ description: 'Student date of birth' })
  @Column({ type: 'date' })
  dateOfBirth: Date;

  @ApiProperty({ description: 'Student gender', enum: Gender })
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @ApiProperty({ description: 'Student blood group', enum: BloodGroup, required: false })
  @Column({ type: 'enum', enum: BloodGroup, nullable: true })
  bloodGroup?: BloodGroup;

  @ApiProperty({ description: 'Student address' })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiProperty({ description: 'Student city' })
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({ description: 'Student state/province' })
  @Column({ nullable: true })
  state?: string;

  @ApiProperty({ description: 'Student country' })
  @Column({ nullable: true })
  country?: string;

  @ApiProperty({ description: 'Student postal code' })
  @Column({ nullable: true })
  postalCode?: string;

  @ApiProperty({ description: 'Student phone number' })
  @Column({ nullable: true })
  phoneNumber?: string;

  @ApiProperty({ description: 'Student email address' })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ description: 'Student nationality' })
  @Column({ nullable: true })
  nationality?: string;

  @ApiProperty({ description: 'Student religion' })
  @Column({ nullable: true })
  religion?: string;

  @ApiProperty({ description: 'Student emergency contact name' })
  @Column({ nullable: true })
  emergencyContactName?: string;

  @ApiProperty({ description: 'Student emergency contact phone' })
  @Column({ nullable: true })
  emergencyContactPhone?: string;

  @ApiProperty({ description: 'Student emergency contact relationship' })
  @Column({ nullable: true })
  emergencyContactRelationship?: string;

  @ApiProperty({ description: 'Student medical conditions' })
  @Column({ type: 'text', nullable: true })
  medicalConditions?: string;

  @ApiProperty({ description: 'Student allergies' })
  @Column({ type: 'text', nullable: true })
  allergies?: string;

  @ApiProperty({ description: 'Student medications' })
  @Column({ type: 'text', nullable: true })
  medications?: string;

  @ApiProperty({ description: 'Student profile picture URL' })
  @Column({ nullable: true })
  profilePicture?: string;

  @ApiProperty({ description: 'Student admission date' })
  @Column({ type: 'date' })
  admissionDate: Date;

  @ApiProperty({ description: 'Student graduation date' })
  @Column({ type: 'date', nullable: true })
  graduationDate?: Date;

  @ApiProperty({ description: 'Student status' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: 'Student user account' })
  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  // Relationships will be added here
}

