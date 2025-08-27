import { Entity, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../common/base.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  STAFF = 'staff',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ description: 'User email address' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'User full name' })
  @Column()
  fullName: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.STAFF })
  role: UserRole;

  @ApiProperty({ description: 'User status', enum: UserStatus })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @ApiProperty({ description: 'User phone number' })
  @Column({ nullable: true })
  phoneNumber?: string;

  @ApiProperty({ description: 'User profile picture URL' })
  @Column({ nullable: true })
  profilePicture?: string;

  @ApiProperty({ description: 'Last login timestamp' })
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Exclude()
  @Column({ nullable: true })
  passwordResetToken?: string;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires?: Date;

  @Exclude()
  @Column({ nullable: true })
  verificationToken?: string;

  @ApiProperty({ description: 'Email verified status' })
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ description: 'Two-factor authentication enabled status' })
  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Exclude()
  @Column({ nullable: true })
  twoFactorSecret?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

