import { Entity, Column, ManyToMany, JoinTable, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
import { ParentNotificationLog } from './parent-notification-log.entity';
import { ParentPreferences } from './parent-preferences.entity';

export enum RelationshipType {
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

  @ApiProperty({ description: 'Parent occupation', required: false })
  @Column({ nullable: true })
  occupation?: string;

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

  @ApiProperty({ description: 'Parent profile picture URL' })
  @Column({ nullable: true })
  profilePicture?: string;

  @ApiProperty({ description: 'National ID number', required: false })
  @Column({ nullable: true })
  nationalIdNumber?: string;

  @ApiProperty({ description: 'Parent status' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: 'Preferred notification channels', type: [String] })
  @Column('simple-array', { default: 'email' })
  preferredNotificationChannels: string[];

  @ApiProperty({ description: 'WhatsApp notification enabled' })
  @Column({ default: false })
  whatsappNotificationsEnabled: boolean;

  @ApiProperty({ description: 'SMS notification enabled' })
  @Column({ default: true })
  smsNotificationsEnabled: boolean;

  @ApiProperty({ description: 'Email notification enabled' })
  @Column({ default: true })
  emailNotificationsEnabled: boolean;

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
  students: Student[];

  @ApiProperty({ description: 'Relationship type with students', enum: RelationshipType })
  @Column({ type: 'enum', enum: RelationshipType, default: RelationshipType.GUARDIAN })
  relationshipType: RelationshipType;

  @ApiProperty({ description: 'Emergency contact priority (1 = primary)' })
  @Column({ default: 1 })
  emergencyContactPriority: number;

  @ApiProperty({ description: 'Is authorized to pick up students' })
  @Column({ default: true })
  isAuthorizedForPickup: boolean;

  @ApiProperty({ description: 'Has financial responsibility' })
  @Column({ default: true })
  hasFinancialResponsibility: boolean;

  @ApiProperty({ description: 'Notification logs' })
  @OneToMany(() => ParentNotificationLog, log => log.parent)
  notificationLogs: ParentNotificationLog[];

  @ApiProperty({ description: 'Parent preferences' })
  @OneToOne(() => ParentPreferences)
  @JoinColumn()
  preferences: ParentPreferences;
}

