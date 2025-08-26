import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ClassStatus } from '../entities/class.entity';

export class ClassFilterDto {
  @ApiProperty({ required: false, description: 'Filter by class name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Filter by grade' })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiProperty({ required: false, description: 'Filter by level' })
  @IsOptional()
  @Type(() => Number)
  level?: number;

  @ApiProperty({ required: false, enum: ClassStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;

  @ApiProperty({ required: false, description: 'Filter by academic year ID' })
  @IsOptional()
  @IsUUID()
  academicYearId?: string;

  @ApiProperty({ required: false, description: 'Filter by head teacher ID' })
  @IsOptional()
  @IsUUID()
  headTeacherId?: string;

  @ApiProperty({ required: false, description: 'Filter by teacher ID' })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty({ required: false, description: 'Filter by subject ID' })
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Sort field', default: 'level' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'level';

  @ApiProperty({ required: false, description: 'Sort order', default: 'ASC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

