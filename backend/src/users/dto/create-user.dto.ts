import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.STAFF,
  })
  @IsEnum(UserRole, { message: 'Invalid role' })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  @IsEnum(UserStatus, { message: 'Invalid status' })
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'User profile picture URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString({ message: 'Profile picture URL must be a string' })
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({
    description: 'Send welcome email to user',
    default: true,
  })
  @IsOptional()
  sendWelcomeEmail?: boolean;

  @ApiProperty({
    description: 'Generate random password',
    default: false,
  })
  @IsOptional()
  generateRandomPassword?: boolean;
}

