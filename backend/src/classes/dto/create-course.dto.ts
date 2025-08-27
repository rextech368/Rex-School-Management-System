import { 
  IsString, 
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
  Max,
  IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ description: 'Course code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Course name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Course description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Department or subject area' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ description: 'Credit hours or units' })
  @IsNumber()
  @Min(0)
  @Max(20)
  credits: number;

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

