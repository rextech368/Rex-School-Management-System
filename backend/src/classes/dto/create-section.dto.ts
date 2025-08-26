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
import { SectionStatus } from '../entities/section.entity';

export class CreateSectionDto {
  @ApiProperty({ description: 'Section name' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ required: false, description: 'Display name for the section' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string;

  @ApiProperty({ required: false, description: 'Section description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ required: false, description: 'Maximum capacity of students' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  capacity?: number;

  @ApiProperty({ required: false, enum: SectionStatus, default: SectionStatus.ACTIVE, description: 'Section status' })
  @IsOptional()
  @IsEnum(SectionStatus)
  status?: SectionStatus;

  @ApiProperty({ required: false, description: 'Room number' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  roomNumber?: string;

  @ApiProperty({ required: false, description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiProperty({ description: 'Class ID that this section belongs to' })
  @IsUUID()
  classId: string;

  @ApiProperty({ required: false, description: 'Class section teacher ID' })
  @IsOptional()
  @IsUUID()
  classSectionTeacherId?: string;

  @ApiProperty({ required: false, description: 'Array of teacher IDs' })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  teacherIds?: string[];
}

