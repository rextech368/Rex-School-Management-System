import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, StudentStatus } from '../entities/student.entity';

export class StudentFilterDto {
  @ApiProperty({ required: false, description: 'Filter by student name (first, middle, or last)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Filter by admission number' })
  @IsOptional()
  @IsString()
  admissionNumber?: string;

  @ApiProperty({ required: false, description: 'Filter by class ID' })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiProperty({ required: false, description: 'Filter by section ID' })
  @IsOptional()
  @IsUUID()
  sectionId?: string;

  @ApiProperty({ required: false, description: 'Filter by academic year ID' })
  @IsOptional()
  @IsUUID()
  academicYearId?: string;

  @ApiProperty({ required: false, description: 'Filter by gender', enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ required: false, description: 'Filter by status', enum: StudentStatus })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;

  @ApiProperty({ required: false, description: 'Filter by admission date from' })
  @IsOptional()
  @IsDateString()
  admissionDateFrom?: string;

  @ApiProperty({ required: false, description: 'Filter by admission date to' })
  @IsOptional()
  @IsDateString()
  admissionDateTo?: string;

  @ApiProperty({ required: false, description: 'Filter by date of birth from' })
  @IsOptional()
  @IsDateString()
  dateOfBirthFrom?: string;

  @ApiProperty({ required: false, description: 'Filter by date of birth to' })
  @IsOptional()
  @IsDateString()
  dateOfBirthTo?: string;

  @ApiProperty({ required: false, description: 'Filter by nationality' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ required: false, description: 'Filter by religion' })
  @IsOptional()
  @IsString()
  religion?: string;

  @ApiProperty({ required: false, description: 'Filter by house/team' })
  @IsOptional()
  @IsString()
  house?: string;

  @ApiProperty({ required: false, description: 'Filter by bus route' })
  @IsOptional()
  @IsString()
  busRouteNumber?: string;

  @ApiProperty({ required: false, description: 'Filter by hostel' })
  @IsOptional()
  @IsString()
  hostelRoomNumber?: string;

  @ApiProperty({ required: false, description: 'Filter by fee category' })
  @IsOptional()
  @IsString()
  feeCategory?: string;

  @ApiProperty({ required: false, description: 'Include inactive students' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeInactive?: boolean;

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

