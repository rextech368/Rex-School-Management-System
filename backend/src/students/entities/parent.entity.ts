import { Entity, Column, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Student } from './student.entity';
import { User } from '../../users/entities/user.entity';

export enum ParentRelationship {
  FATHER = 'father',
  MOTHER = 'mother',
  GUARDIAN = 'guardian',
  GRANDPARENT = 'grandparent',
  OTHER = 'other',
}

@Entity('parents')
export class Parent extends BaseEntity {
  @ApiProperty({ description: 'Parent first name' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Parent last name' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'Parent email address' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Parent phone number' })
  @Column()
  phoneNumber: string;

  @ApiProperty({ description: 'Alternative phone number', required: false })
  @Column({ nullable: true })
  alternativePhoneNumber?: string;

  @ApiProperty({ description: 'Parent address' })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiProperty({ description: 'Parent city' })
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({ description: 'Parent state/province' })
  @Column({ nullable: true })
  state?: string;

  @ApiProperty({ description: 'Parent country' })
  @Column({ nullable: true })
  country?: string;

  @ApiProperty({ description: 'Parent postal code' })
  @Column({ nullable: true })
  postalCode?: string;

  @ApiProperty({ description: 'Parent occupation' })
  @Column({ nullable: true })
  occupation?: string;

  @ApiProperty({ description: 'Parent employer' })
  @Column({ nullable: true })
  employer?: string;

  @ApiProperty({ description: 'Parent relationship to student', enum: ParentRelationship })
  @Column({
    type: 'enum',
    enum: ParentRelationship,
    default: ParentRelationship.GUARDIAN,
  })
  relationship: ParentRelationship;

  @ApiProperty({ description: 'Is emergency contact' })
  @Column({ default: false })
  isEmergencyContact: boolean;

  @ApiProperty({ description: 'Is authorized to pick up student' })
  @Column({ default: false })
  isAuthorizedToPickup: boolean;

  @ApiProperty({ description: 'Receives school communications' })
  @Column({ default: true })
  receivesSchoolCommunications: boolean;

  @ApiProperty({ description: 'Has portal access' })
  @Column({ default: true })
  hasPortalAccess: boolean;

  @ApiProperty({ description: 'National ID number' })
  @Column({ nullable: true })
  nationalIdNumber?: string;

  @ApiProperty({ description: 'Profile picture URL' })
  @Column({ nullable: true })
  profilePicture?: string;

  @ApiProperty({ description: 'Notes about the parent' })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Parent user account' })
  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @ApiProperty({ description: 'Students associated with this parent' })
  @ManyToMany(() => Student)
  @JoinTable({
    name: 'parent_student',
    joinColumn: { name: 'parent_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'student_id', referencedColumnName: 'id' },
  })
  students?: Student[];
}

