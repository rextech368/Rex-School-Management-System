import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { SectionStatus } from '../entities/section.entity';

export class SectionFilterDto {
  @ApiProperty({ required: false, description: 'Filter by section name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, enum: SectionStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(SectionStatus)
  status?: SectionStatus;

  @ApiProperty({ required: false, description: 'Filter by class ID' })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiProperty({ required: false, description: 'Filter by class section teacher ID' })
  @IsOptional()
  @IsUUID()
  classSectionTeacherId?: string;

  @ApiProperty({ required: false, description: 'Filter by teacher ID' })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Sort field', default: 'name' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'name';

  @ApiProperty({ required: false, description: 'Sort order', default: 'ASC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

