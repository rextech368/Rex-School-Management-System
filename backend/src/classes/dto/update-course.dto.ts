import { 
  IsString, 
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
  Max
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiProperty({ description: 'Course code', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Course name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Course description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Department or subject area', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: 'Credit hours or units', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  credits?: number;

  @ApiProperty({ description: 'Minimum grade level required', required: false })
  @IsOptional()
  @IsString()
  minGradeLevel?: string;

  @ApiProperty({ description: 'Maximum grade level allowed', required: false })
  @IsOptional()
  @IsString()
  maxGradeLevel?: string;

  @ApiProperty({ description: 'Prerequisites (comma-separated course codes)', required: false })
  @IsOptional()
  @IsString()
  prerequisites?: string;

  @ApiProperty({ description: 'Corequisites (comma-separated course codes)', required: false })
  @IsOptional()
  @IsString()
  corequisites?: string;

  @ApiProperty({ description: 'Whether the course is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Course syllabus URL', required: false })
  @IsOptional()
  @IsUrl()
  syllabusUrl?: string;

  @ApiProperty({ description: 'Course materials URL', required: false })
  @IsOptional()
  @IsUrl()
  materialsUrl?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

