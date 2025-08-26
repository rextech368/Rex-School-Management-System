import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsUUID, 
  IsBoolean,
  IsObject,
  ValidateNested
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GradeScale } from '../enums/grade-scale.enum';

export class CreateGradeTemplateDto {
  @ApiProperty({ description: 'Name of the grade template' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the grade template', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Grade scale used for this template', enum: GradeScale })
  @IsEnum(GradeScale)
  gradeScale: GradeScale;

  @ApiProperty({ 
    description: 'JSON structure defining grade categories and weights',
    example: {
      'Assignments': 30,
      'Quizzes': 20,
      'Tests': 30,
      'Final Exam': 20
    }
  })
  @IsObject()
  categories: Record<string, any>;

  @ApiProperty({ 
    description: 'JSON structure defining grade thresholds for letter grades',
    required: false,
    example: {
      'A': 90,
      'B': 80,
      'C': 70,
      'D': 60,
      'F': 0
    }
  })
  @IsOptional()
  @IsObject()
  letterGradeThresholds?: Record<string, number>;

  @ApiProperty({ 
    description: 'JSON structure defining custom grade scales if applicable',
    required: false
  })
  @IsOptional()
  @IsObject()
  customScales?: Record<string, any>;

  @ApiProperty({ description: 'Whether this is a system default template' })
  @IsBoolean()
  isSystemDefault: boolean;

  @ApiProperty({ description: 'School or organization ID this template belongs to', required: false })
  @IsOptional()
  @IsUUID()
  schoolId?: string;

  @ApiProperty({ description: 'User ID who created this template' })
  @IsUUID()
  createdBy: string;
}

