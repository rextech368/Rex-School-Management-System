import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserGender, UserStatus } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ 
    description: 'User role', 
    enum: UserRole 
  })
  role: UserRole;

  @ApiProperty({ 
    description: 'User status', 
    enum: UserStatus 
  })
  status: UserStatus;

  @ApiPropertyOptional({ description: 'First name' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name' })
  lastName?: string;

  @ApiPropertyOptional({ 
    description: 'Gender', 
    enum: UserGender 
  })
  gender?: UserGender;

  @ApiPropertyOptional({ description: 'Date of birth' })
  dateOfBirth?: Date;

  @ApiPropertyOptional({ description: 'Phone number' })
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Address' })
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province' })
  state?: string;

  @ApiPropertyOptional({ description: 'Country' })
  country?: string;

  @ApiPropertyOptional({ description: 'Postal/ZIP code' })
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Profile image URL' })
  profileImageUrl?: string;

  @ApiPropertyOptional({ description: 'Last login date' })
  last_login?: Date;

  @ApiProperty({ description: 'Email verification status' })
  email_verified: boolean;

  @ApiProperty({ description: 'Account creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Last update date' })
  updated_at: Date;
}

