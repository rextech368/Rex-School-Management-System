import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ParentRelationship } from '../../entities/parent.entity';

export class ParentFilterDto {
  @ApiProperty({ required: false, description: 'Filter by parent name (first or last)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Filter by email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, description: 'Filter by phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false, description: 'Filter by relationship', enum: ParentRelationship })
  @IsOptional()
  @IsEnum(ParentRelationship)
  relationship?: ParentRelationship;

  @ApiProperty({ required: false, description: 'Filter by student ID' })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiProperty({ required: false, description: 'Filter by city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false, description: 'Filter by country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false, description: 'Filter by occupation' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Sort field', default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, description: 'Sort order', default: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

