import { 
  IsString, 
  IsUUID,
  IsEnum,
  IsInt,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClassType } from '../enums/class-type.enum';

export class UpdateClassDto {
  @ApiProperty({ description: 'Class name or section', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Class code (unique identifier)', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Course ID', required: false })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiProperty({ description: 'Term ID', required: false })
  @IsOptional()
  @IsUUID()
  termId?: string;

  @ApiProperty({ description: 'Class type', enum: ClassType, required: false })
  @IsOptional()
  @IsEnum(ClassType)
  type?: ClassType;

  @ApiProperty({ description: 'Maximum enrollment capacity', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiProperty({ description: 'Room or location', required: false })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiProperty({ description: 'Building', required: false })
  @IsOptional()
  @IsString()
  building?: string;

  @ApiProperty({ description: 'Primary teacher ID', required: false })
  @IsOptional()
  @IsUUID()
  primaryTeacherId?: string;

  @ApiProperty({ description: 'Whether the class is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Syllabus URL (overrides course syllabus)', required: false })
  @IsOptional()
  @IsUrl()
  syllabusUrl?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Assistant teacher IDs', required: false, type: [String] })
  @IsOptional()
  @IsUUID(undefined, { each: true })
  assistantTeacherIds?: string[];
}

