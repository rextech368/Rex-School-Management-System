import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsUUID,
  IsArray,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClassStatus } from '../entities/class.entity';

export class CreateClassDto {
  @ApiProperty({ description: 'Class name' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ required: false, description: 'Display name for the class' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string;

  @ApiProperty({ required: false, description: 'Class description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ required: false, description: 'Grade (e.g., "Grade 1", "Form 3")' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  grade?: string;

  @ApiProperty({ required: false, description: 'Level number (e.g., 1, 2, 3)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(20)
  level?: number;

  @ApiProperty({ required: false, description: 'Maximum capacity of students' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(200)
  capacity?: number;

  @ApiProperty({ required: false, enum: ClassStatus, default: ClassStatus.ACTIVE, description: 'Class status' })
  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;

  @ApiProperty({ required: false, description: 'Room number' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  roomNumber?: string;

  @ApiProperty({ required: false, description: 'Building name or number' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  building?: string;

  @ApiProperty({ required: false, description: 'Floor number or name' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  floor?: string;

  @ApiProperty({ required: false, description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiProperty({ required: false, description: 'Academic year ID' })
  @IsOptional()
  @IsUUID()
  academicYearId?: string;

  @ApiProperty({ required: false, description: 'Head teacher ID' })
  @IsOptional()
  @IsUUID()
  headTeacherId?: string;

  @ApiProperty({ required: false, description: 'Array of teacher IDs' })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  teacherIds?: string[];

  @ApiProperty({ required: false, description: 'Array of subject IDs' })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  subjectIds?: string[];
}

