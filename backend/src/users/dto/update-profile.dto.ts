import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsISO8601 } from 'class-validator';
import { UserGender } from '../entities/user.entity';

export class UpdateProfileDto {
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

