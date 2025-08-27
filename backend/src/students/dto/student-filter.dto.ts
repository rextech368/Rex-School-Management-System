import { 
  IsString, 
  IsEnum, 
  IsOptional,
  IsDate
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../enums/gender.enum';
import { StudentStatus } from '../enums/student-status.enum';

export class StudentFilterDto {
  @ApiProperty({ description: 'Search term for name, email, or student ID', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by grade level', required: false })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiProperty({ description: 'Filter by class ID', required: false })
  @IsOptional()
  @IsString()
  classId?: string;

  @ApiProperty({ description: 'Filter by gender', enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ description: 'Filter by status', enum: StudentStatus, required: false })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;

  @ApiProperty({ description: 'Filter by enrollment date (start)', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  enrollmentDateStart?: Date;

  @ApiProperty({ description: 'Filter by enrollment date (end)', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  enrollmentDateEnd?: Date;

  @ApiProperty({ description: 'Filter by date of birth (start)', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirthStart?: Date;

  @ApiProperty({ description: 'Filter by date of birth (end)', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirthEnd?: Date;

  @ApiProperty({ description: 'Filter by nationality', required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ description: 'Filter by city', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Filter by state/province', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Filter by country', required: false })
  @IsOptional()
  @IsString()
  country?: string;
}

