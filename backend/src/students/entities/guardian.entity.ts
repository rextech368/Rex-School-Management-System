import { Entity, Column, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Student } from './student.entity';
import { User } from '../../users/entities/user.entity';

@Entity('guardians')
export class Guardian extends BaseEntity {
  @ApiProperty({ description: 'Full name of the guardian' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Relationship to the student' })
  @Column()
  relationship: string;

  @ApiProperty({ description: 'Email address of the guardian', required: false })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ description: 'Phone number of the guardian' })
  @Column()
  phoneNumber: string;

  @ApiProperty({ description: 'Alternative phone number', required: false })
  @Column({ nullable: true })
  alternativePhoneNumber?: string;

  @ApiProperty({ description: 'Address of the guardian', required: false })
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

  @ApiProperty({ description: 'Occupation of the guardian', required: false })
  @Column({ nullable: true })
  occupation?: string;

  @ApiProperty({ description: 'Employer name', required: false })
  @Column({ nullable: true })
  employer?: string;

  @ApiProperty({ description: 'Whether this is the primary guardian' })
  @Column({ default: false })
  isPrimary: boolean;

  @ApiProperty({ description: 'Whether this guardian has emergency contact privileges' })
  @Column({ default: false })
  isEmergencyContact: boolean;

  @ApiProperty({ description: 'Whether this guardian has pickup authorization' })
  @Column({ default: false })
  hasPickupAuthorization: boolean;

  @ApiProperty({ description: 'Additional notes', required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'User ID if guardian has system access', required: false })
  @Column({ nullable: true })
  userId?: string;

  @ApiProperty({ description: 'User account if guardian has system access', required: false })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ApiProperty({ description: 'Students associated with this guardian', type: [Student] })
  @ManyToMany(() => Student, student => student.guardians)
  students: Student[];
}

