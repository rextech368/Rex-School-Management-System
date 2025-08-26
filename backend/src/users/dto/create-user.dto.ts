import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, Matches, IsDate, IsISO8601 } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserGender, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'Username for the user', example: 'johndoe' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, underscores and hyphens' })
  username: string;

  @ApiProperty({ description: 'Email address', example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'StrongP@ssw0rd' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  })
  password: string;

  @ApiProperty({ 
    description: 'User role', 
    enum: UserRole,
    example: UserRole.STUDENT
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ 
    description: 'User status', 
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    example: UserStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'First name', example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ 
    description: 'Gender', 
    enum: UserGender,
    example: UserGender.MALE
  })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @ApiPropertyOptional({ 
    description: 'Date of birth (ISO format)', 
    example: '1990-01-01' 
  })
  @IsOptional()
  @IsISO8601()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1234567890' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Address', example: '123 Main St' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City', example: 'New York' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province', example: 'NY' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Country', example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Postal/ZIP code', example: '10001' })
  @IsOptional()
  @IsString()
  postalCode?: string;
}

