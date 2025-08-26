import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserStatus } from '../entities/user.entity';

export class UserFilterDto {
  @ApiPropertyOptional({ description: 'Search term for username, email, or name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by role', 
    enum: UserRole 
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ 
    description: 'Filter by status', 
    enum: UserStatus 
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ 
    description: 'Filter by email verification status' 
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  emailVerified?: boolean;

  @ApiPropertyOptional({ 
    description: 'Page number (1-based)', 
    default: 1,
    minimum: 1 
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Number of items per page', 
    default: 10,
    minimum: 1,
    maximum: 100 
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    description: 'Sort field', 
    default: 'created_at' 
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'created_at';

  @ApiPropertyOptional({ 
    description: 'Sort order (ASC or DESC)', 
    default: 'DESC' 
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

